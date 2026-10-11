export type SessionStatus = 
  | 'DRAFT' 
  | 'LOBBY' 
  | 'COUNTDOWN' 
  | 'RUNNING' 
  | 'LOCKED' 
  | 'RESULTS' 
  | 'ARCHIVED';

export type MemeStatus = 'SỐNG' | 'SỐNG HẤP HỐI' | 'HẸO';

export interface GameItem {
  id: string;
  nameVi: string;
  nameEn: string;
  explanationVi?: string;
}

export interface NASAItemDetails extends GameItem {
  expertRank: number;
  explanationVi: string;
}

export interface SessionData {
  id: string;
  code: string;
  status: SessionStatus;
  join_locked: boolean;
  is_test: boolean;
  start_at: string | null;
  end_at: string | null;
  reveal_at: string | null;
  leaderboard_visible: boolean;
  created_at: string;
  player_count?: number;
}

export interface PlayerData {
  id: string;
  session_id: string;
  display_name: string;
  joined_at: string;
  last_seen_at: string;
}

export interface SubmissionData {
  id: string;
  session_id: string;
  player_id: string;
  ordered_item_ids: string[];
  error_score: number;
  survival_score: number;
  status: MemeStatus;
  variant_id: number;
  submitted_at: string;
  display_name?: string;
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  display_name: string;
  survival_score: number;
  error_score: number;
  status: MemeStatus;
  submitted_at: string;
}

export interface MemeVariant {
  id: number;
  status: MemeStatus;
  paragraph: string;
  bullets: string[];
}
