-- ====================================================================
-- FIX SUPABASE PERMISSIONS CHO DỰ ÁN: NHIỆM VỤ MẶT TRĂNG (MOON MISSION)
-- Sao chép toàn bộ nội dung file này và chạy trong Supabase SQL Editor
-- (https://supabase.com/dashboard/project/bmmxpsabrcydsykvuxtk/sql)
-- ====================================================================

-- 1. Cấp quyền Schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Đặt quyền mặc định cho các bảng tạo trong tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 3. Đảm bảo các bảng đã bật RLS
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS draft_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS submissions ENABLE ROW LEVEL SECURITY;

-- 4. Bổ sung Policies thông thoáng để Backend Server Role và Khách (Anon) hoạt động mượt mà
DROP POLICY IF EXISTS "Public read sessions" ON sessions;
CREATE POLICY "Public read sessions" ON sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access for service role on sessions" ON sessions;
CREATE POLICY "Full access for service role on sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read players in session" ON players;
CREATE POLICY "Public read players in session" ON players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert player" ON players;
CREATE POLICY "Public insert player" ON players FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on players" ON players;
CREATE POLICY "Full access for service role on players" ON players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Manage draft rankings" ON draft_rankings;
CREATE POLICY "Manage draft rankings" ON draft_rankings FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access for service role on draft_rankings" ON draft_rankings;
CREATE POLICY "Full access for service role on draft_rankings" ON draft_rankings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Insert submissions" ON submissions;
CREATE POLICY "Insert submissions" ON submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on submissions" ON submissions;
CREATE POLICY "Full access for service role on submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Read submissions if revealed or admin" ON submissions;
CREATE POLICY "Read submissions if revealed or admin" ON submissions FOR SELECT USING (true);

-- 5. Đảm bảo phòng mặc định NASA01 luôn tồn tại
INSERT INTO sessions (code, status, join_locked, is_test)
VALUES ('NASA01', 'LOBBY', FALSE, FALSE)
ON CONFLICT (code) DO UPDATE
SET status = 'LOBBY', join_locked = FALSE;
