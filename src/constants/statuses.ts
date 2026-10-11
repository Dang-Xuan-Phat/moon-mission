import { MemeStatus } from '@/types/game';

export interface StatusConfig {
  label: MemeStatus;
  minScore: number;
  maxScore: number;
  image: string;
  badgeClass: string;
  glowClass: string;
}

export const STATUS_CONFIG: Record<MemeStatus, StatusConfig> = {
  SỐNG: {
    label: 'SỐNG',
    minScore: 70,
    maxScore: 100,
    image: '/assets/cat-song.png',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
  },
  'SỐNG HẤP HỐI': {
    label: 'SỐNG HẤP HỐI',
    minScore: 40,
    maxScore: 69,
    image: '/assets/cat-haphoi.png',
    badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
  },
  HẸO: {
    label: 'HẸO',
    minScore: 0,
    maxScore: 39,
    image: '/assets/cat-heo.png',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
  },
};
