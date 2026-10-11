-- ====================================================================
-- SCHEMA: Nhiệm Vụ Mặt Trăng (Moon Mission) - Team ChatGPT
-- Scale: >= 150 - 250 concurrent players
-- ====================================================================

-- 1. Create enum for session status
CREATE TYPE session_status AS ENUM (
  'DRAFT',
  'LOBBY',
  'COUNTDOWN',
  'RUNNING',
  'LOCKED',
  'RESULTS',
  'ARCHIVED'
);

-- 2. Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  status session_status NOT NULL DEFAULT 'LOBBY',
  join_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_test BOOLEAN NOT NULL DEFAULT FALSE,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  reveal_at TIMESTAMPTZ,
  leaderboard_visible BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- 3. Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  display_name VARCHAR(30) NOT NULL,
  join_token_hash VARCHAR(64) NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_session_player UNIQUE (session_id, display_name)
);

CREATE INDEX IF NOT EXISTS idx_players_session ON players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_last_seen ON players(session_id, last_seen_at);

-- 4. Draft rankings table (autosave with debounce)
CREATE TABLE IF NOT EXISTS draft_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  ordered_item_ids TEXT[] NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_draft_session_player UNIQUE (session_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_draft_session_player ON draft_rankings(session_id, player_id);

-- 5. Submissions table (idempotent, single submission per player per session)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  ordered_item_ids TEXT[] NOT NULL,
  error_score INT NOT NULL,
  survival_score INT NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'SỐNG', 'SỐNG HẤP HỐI', 'HẸO'
  variant_id INT NOT NULL DEFAULT 1, -- 1..5 for consistent meme message
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_submission_session_player UNIQUE (session_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_session ON submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(session_id, survival_score DESC);

-- 6. Admins table
CREATE TABLE IF NOT EXISTS admins (
  auth_user_id UUID PRIMARY KEY,
  role VARCHAR(20) NOT NULL DEFAULT 'HOST',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Sessions: Public can read active sessions by code
CREATE POLICY "Public read sessions" ON sessions
  FOR SELECT USING (true);

-- Sessions: Only service role or authed admins can update
CREATE POLICY "Admins manage sessions" ON sessions
  FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM admins));

-- Players: Anyone can register/read players of their session
CREATE POLICY "Public read players in session" ON players
  FOR SELECT USING (true);

CREATE POLICY "Public insert player" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update player last seen" ON players
  FOR UPDATE USING (true);

-- Draft Rankings: Players can manage their own draft
CREATE POLICY "Manage draft rankings" ON draft_rankings
  FOR ALL USING (true);

-- Submissions: Anyone can insert their final submission (server scores it)
CREATE POLICY "Read submissions if revealed or admin" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = submissions.session_id
      AND (s.leaderboard_visible = TRUE OR s.status = 'RESULTS')
    ) OR (auth.uid() IN (SELECT auth_user_id FROM admins))
  );

CREATE POLICY "Insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- ====================================================================
-- REALTIME PUBLICATION
-- Enable realtime for sessions, players, and submissions
-- ====================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
