import { SessionData, PlayerData, SubmissionData, LeaderboardEntry } from '@/types/game';
import { calculateScore, NASA_EXPERT_ITEMS } from '@/lib/server/scoring';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabase/server';

interface InMemorySessionStore {
  sessions: Map<string, SessionData>;
  players: Map<string, PlayerData[]>; // session_id -> players
  drafts: Map<string, Map<string, string[]>>; // session_id -> (player_id -> items)
  submissions: Map<string, Map<string, SubmissionData>>; // session_id -> (player_id -> submission)
}

declare global {
  // eslint-disable-next-line no-var
  var __MOON_STORE__: InMemorySessionStore | undefined;
}

if (!globalThis.__MOON_STORE__) {
  globalThis.__MOON_STORE__ = {
    sessions: new Map(),
    players: new Map(),
    drafts: new Map(),
    submissions: new Map(),
  };

  // Seed a demo session for immediate testing out of the box
  const demoSession: SessionData = {
    id: 'demo-session-uuid-1',
    code: 'NASA01',
    status: 'LOBBY',
    join_locked: false,
    is_test: false,
    start_at: null,
    end_at: null,
    reveal_at: null,
    leaderboard_visible: false,
    created_at: new Date().toISOString(),
  };
  globalThis.__MOON_STORE__.sessions.set('NASA01', demoSession);
  globalThis.__MOON_STORE__.players.set(demoSession.id, []);
  globalThis.__MOON_STORE__.drafts.set(demoSession.id, new Map());
  globalThis.__MOON_STORE__.submissions.set(demoSession.id, new Map());
}

const memStore = globalThis.__MOON_STORE__;

export class SessionManager {
  /**
   * Generates a 6-character room code (alphanumeric uppercase, excluding confusing chars)
   */
  static generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new session
   */
  static async createSession(customCode?: string, isTest = false): Promise<SessionData> {
    const code = (customCode?.trim().toUpperCase() || this.generateCode()).slice(0, 6);

    if (isSupabaseServerConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from('sessions')
          .insert({
            code,
            status: 'LOBBY',
            join_locked: false,
            is_test: isTest,
          })
          .select()
          .single();

        if (!error && data) {
          return data as SessionData;
        }
        console.warn('Supabase createSession warning, falling back to in-memory store:', error?.message);
      } catch (err: any) {
        console.warn('Supabase createSession exception, falling back to in-memory store:', err.message);
      }
    }

    // In-memory fallback
    const newSession: SessionData = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      code,
      status: 'LOBBY',
      join_locked: false,
      is_test: isTest,
      start_at: null,
      end_at: null,
      reveal_at: null,
      leaderboard_visible: false,
      created_at: new Date().toISOString(),
    };

    memStore.sessions.set(code, newSession);
    memStore.players.set(newSession.id, []);
    memStore.drafts.set(newSession.id, new Map());
    memStore.submissions.set(newSession.id, new Map());

    return newSession;
  }

  /**
   * Get session by code
   */
  static async getSession(code: string): Promise<SessionData | null> {
    const formattedCode = code.trim().toUpperCase();

    if (isSupabaseServerConfigured && supabaseServer) {
      const { data, error } = await supabaseServer
        .from('sessions')
        .select('*')
        .eq('code', formattedCode)
        .maybeSingle();

      if (error || !data) return null;

      // Get player count
      const { count } = await supabaseServer
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', data.id);

      return {
        ...data,
        player_count: count ?? 0,
      } as SessionData;
    }

    const session = memStore.sessions.get(formattedCode);
    if (!session) return null;

    // Check if session end_at has passed and needs auto-lock
    if (session.status === 'RUNNING' && session.end_at) {
      const now = Date.now();
      const endTime = new Date(session.end_at).getTime();
      if (now >= endTime) {
        session.status = 'LOCKED';
      }
    }

    const players = memStore.players.get(session.id) || [];
    return {
      ...session,
      player_count: players.length,
    };
  }

  /**
   * Join a session
   */
  static async joinSession(
    code: string,
    displayName: string
  ): Promise<{ player: PlayerData; session: SessionData }> {
    const formattedCode = code.trim().toUpperCase();
    const cleanName = displayName.trim();

    if (!cleanName || cleanName.length > 30) {
      throw new Error('Tên hiển thị không hợp lệ (1-30 ký tự).');
    }

    const session = await this.getSession(formattedCode);
    if (!session) {
      throw new Error('Mã phòng không tồn tại.');
    }

    if (session.join_locked) {
      throw new Error('Phòng đã bị khóa tham gia bởi người chủ trì.');
    }

    if (session.status === 'ARCHIVED' || session.status === 'RESULTS') {
      throw new Error('Phiên chơi này đã kết thúc.');
    }

    if (isSupabaseServerConfigured && supabaseServer) {
      try {
        // Check existing player with same name
        const { data: existingPlayer } = await supabaseServer
          .from('players')
          .select('*')
          .eq('session_id', session.id)
          .eq('display_name', cleanName)
          .maybeSingle();

        if (existingPlayer) {
          return { player: existingPlayer as PlayerData, session };
        }

        const { data: newPlayer, error } = await supabaseServer
          .from('players')
          .insert({
            session_id: session.id,
            display_name: cleanName,
            join_token_hash: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          })
          .select()
          .single();

        if (!error && newPlayer) {
          return { player: newPlayer as PlayerData, session };
        }
        console.warn('Supabase join warning, falling back to in-memory store:', error?.message);
      } catch (err: any) {
        console.warn('Supabase join exception, falling back to in-memory store:', err.message);
      }
    }

    // In-memory
    const playerList = memStore.players.get(session.id) || [];
    const existing = playerList.find((p) => p.display_name.toLowerCase() === cleanName.toLowerCase());

    if (existing) {
      existing.last_seen_at = new Date().toISOString();
      return { player: existing, session };
    }

    const newPlayer: PlayerData = {
      id: `player-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      session_id: session.id,
      display_name: cleanName,
      joined_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    };

    playerList.push(newPlayer);
    memStore.players.set(session.id, playerList);

    return { player: newPlayer, session };
  }

  /**
   * Save draft ranking (debounced autosave)
   */
  static async saveDraft(
    sessionId: string,
    playerId: string,
    orderedItemIds: string[]
  ): Promise<void> {
    if (!Array.isArray(orderedItemIds) || orderedItemIds.length !== 15) {
      return;
    }

    if (isSupabaseServerConfigured && supabaseServer) {
      await supabaseServer.from('draft_rankings').upsert(
        {
          session_id: sessionId,
          player_id: playerId,
          ordered_item_ids: orderedItemIds,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,player_id' }
      );
      return;
    }

    let sessionDrafts = memStore.drafts.get(sessionId);
    if (!sessionDrafts) {
      sessionDrafts = new Map();
      memStore.drafts.set(sessionId, sessionDrafts);
    }
    sessionDrafts.set(playerId, orderedItemIds);
  }

  /**
   * Get draft ranking
   */
  static async getDraft(sessionId: string, playerId: string): Promise<string[] | null> {
    if (isSupabaseServerConfigured && supabaseServer) {
      const { data } = await supabaseServer
        .from('draft_rankings')
        .select('ordered_item_ids')
        .eq('session_id', sessionId)
        .eq('player_id', playerId)
        .maybeSingle();

      return data?.ordered_item_ids || null;
    }

    const sessionDrafts = memStore.drafts.get(sessionId);
    return sessionDrafts?.get(playerId) || null;
  }

  /**
   * Submit ranking and calculate score on server
   */
  static async submitRanking(
    sessionId: string,
    playerId: string,
    orderedItemIds: string[]
  ): Promise<SubmissionData> {
    // 1. Calculate score on server
    const { errorScore, survivalScore, status, variantId } = calculateScore(orderedItemIds);

    const nowIso = new Date().toISOString();

    if (isSupabaseServerConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from('submissions')
          .upsert(
            {
              session_id: sessionId,
              player_id: playerId,
              ordered_item_ids: orderedItemIds,
              error_score: errorScore,
              survival_score: survivalScore,
              status,
              variant_id: variantId,
              submitted_at: nowIso,
            },
            { onConflict: 'session_id,player_id' }
          )
          .select()
          .single();

        if (!error && data) {
          return data as SubmissionData;
        }
        console.warn('Supabase submit warning, falling back to in-memory store:', error?.message);
      } catch (err: any) {
        console.warn('Supabase submit exception, falling back to in-memory store:', err.message);
      }
    }

    let sessionSubmissions = memStore.submissions.get(sessionId);
    if (!sessionSubmissions) {
      sessionSubmissions = new Map();
      memStore.submissions.set(sessionId, sessionSubmissions);
    }

    const existing = sessionSubmissions.get(playerId);
    if (existing) {
      return existing; // idempotent
    }

    const submission: SubmissionData = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      session_id: sessionId,
      player_id: playerId,
      ordered_item_ids: orderedItemIds,
      error_score: errorScore,
      survival_score: survivalScore,
      status,
      variant_id: variantId,
      submitted_at: nowIso,
    };

    sessionSubmissions.set(playerId, submission);
    return submission;
  }

  /**
   * Get submission of a specific player
   */
  static async getPlayerSubmission(
    sessionId: string,
    playerId: string
  ): Promise<SubmissionData | null> {
    if (isSupabaseServerConfigured && supabaseServer) {
      const { data } = await supabaseServer
        .from('submissions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('player_id', playerId)
        .maybeSingle();

      return (data as SubmissionData) || null;
    }

    const sessionSubmissions = memStore.submissions.get(sessionId);
    return sessionSubmissions?.get(playerId) || null;
  }

  /**
   * Update session status / controls (Host actions)
   */
  static async updateSessionControls(
    code: string,
    action: 'start_now' | 'start_scheduled' | 'lock_join' | 'unlock_join' | 'reveal' | 'hide_leaderboard' | 'reset' | 'archive',
    scheduledStartTime?: string
  ): Promise<SessionData> {
    const session = await this.getSession(code);
    if (!session) {
      throw new Error('Phòng không tồn tại.');
    }

    const now = new Date();
    const updates: Partial<SessionData> = {};

    switch (action) {
      case 'start_now': {
        const startAt = now.toISOString();
        const endAt = new Date(now.getTime() + 600 * 1000).toISOString(); // 10 minutes
        updates.status = 'RUNNING';
        updates.start_at = startAt;
        updates.end_at = endAt;
        break;
      }
      case 'start_scheduled': {
        if (!scheduledStartTime) throw new Error('Cần thời gian bắt đầu hẹn giờ.');
        const start = new Date(scheduledStartTime);
        const end = new Date(start.getTime() + 600 * 1000);
        updates.status = 'COUNTDOWN';
        updates.start_at = start.toISOString();
        updates.end_at = end.toISOString();
        break;
      }
      case 'lock_join':
        updates.join_locked = true;
        break;
      case 'unlock_join':
        updates.join_locked = false;
        break;
      case 'reveal':
        updates.status = 'RESULTS';
        updates.reveal_at = now.toISOString();
        updates.leaderboard_visible = true;
        break;
      case 'hide_leaderboard':
        updates.leaderboard_visible = false;
        break;
      case 'reset':
        updates.status = 'LOBBY';
        updates.start_at = null;
        updates.end_at = null;
        updates.reveal_at = null;
        updates.leaderboard_visible = false;
        break;
      case 'archive':
        updates.status = 'ARCHIVED';
        break;
    }

    if (isSupabaseServerConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from('sessions')
          .update(updates)
          .eq('id', session.id)
          .select()
          .single();

        if (!error && data) {
          return data as SessionData;
        }
        console.warn('Supabase updateControls warning, falling back to in-memory store:', error?.message);
      } catch (err: any) {
        console.warn('Supabase updateControls exception, falling back to in-memory store:', err.message);
      }
    }

    // In-memory
    Object.assign(session, updates);
    return session;
  }

  /**
   * Get leaderboard with standard competition ranking (ties get same rank: 1, 2, 2, 4)
   */
  static async getLeaderboard(sessionId: string): Promise<LeaderboardEntry[]> {
    let submissions: (SubmissionData & { players?: { display_name: string } })[] = [];

    if (isSupabaseServerConfigured && supabaseServer) {
      const { data } = await supabaseServer
        .from('submissions')
        .select('*, players(display_name)')
        .eq('session_id', sessionId)
        .order('survival_score', { ascending: false });

      submissions = (data || []) as any[];
    } else {
      const sessionSubs = memStore.submissions.get(sessionId);
      const playerList = memStore.players.get(sessionId) || [];
      const playerMap = new Map(playerList.map((p) => [p.id, p.display_name]));

      if (sessionSubs) {
        const rawList = Array.from(sessionSubs.values());
        rawList.sort((a, b) => b.survival_score - a.survival_score);
        submissions = rawList.map((sub) => ({
          ...sub,
          display_name: playerMap.get(sub.player_id) || 'Phi hành gia',
        }));
      }
    }

    // Calculate tie rankings: 1, 2, 2, 4...
    const leaderboard: LeaderboardEntry[] = [];
    let currentRank = 1;

    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];
      const displayName = sub.display_name || sub.players?.display_name || 'Phi hành gia';

      if (i > 0 && sub.survival_score < submissions[i - 1].survival_score) {
        currentRank = i + 1;
      }

      leaderboard.push({
        rank: currentRank,
        player_id: sub.player_id,
        display_name: displayName,
        survival_score: sub.survival_score,
        error_score: sub.error_score,
        status: sub.status,
        submitted_at: sub.submitted_at,
      });
    }

    return leaderboard;
  }

  /**
   * Generate CSV content for host export
   */
  static async exportCSV(sessionId: string): Promise<string> {
    const leaderboard = await this.getLeaderboard(sessionId);
    const sessionSubs = isSupabaseServerConfigured && supabaseServer
      ? (await supabaseServer.from('submissions').select('*').eq('session_id', sessionId)).data || []
      : Array.from(memStore.submissions.get(sessionId)?.values() || []);

    const subMap = new Map(sessionSubs.map((s) => [s.player_id, s]));

    const header = [
      'Xếp hạng',
      'Tên người chơi',
      'Điểm sống sót (0-100)',
      'Điểm sai lệch E (0-112)',
      'Trạng thái',
      'Thứ tự 15 vật phẩm',
      'Thời gian nộp',
    ].join(',');

    const rows = leaderboard.map((entry) => {
      const sub = subMap.get(entry.player_id);
      const itemOrder = sub?.ordered_item_ids ? `"${sub.ordered_item_ids.join(' > ')}"` : '""';
      const cleanName = `"${entry.display_name.replace(/"/g, '""')}"`;
      return [
        entry.rank,
        cleanName,
        entry.survival_score,
        entry.error_score,
        entry.status,
        itemOrder,
        new Date(entry.submitted_at).toLocaleString('vi-VN'),
      ].join(',');
    });

    return [header, ...rows].join('\n');
  }

  /**
   * Get all NASA expert items (only used during reveal or admin inspection)
   */
  static getExpertSolution() {
    return NASA_EXPERT_ITEMS;
  }
}
