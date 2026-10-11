'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { STATUS_CONFIG } from '@/constants/statuses';
import { getMemeMessage } from '@/constants/statusMessages';
import { NASA_EXPERT_ITEMS } from '@/lib/server/scoring';
import { SubmissionData, LeaderboardEntry, NASAItemDetails } from '@/types/game';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room')?.toUpperCase() || '';

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<{ total: number; songCount: number; hapHoiCount: number; heoCount: number; avgScore: number } | null>(null);
  const [expertSolutions, setExpertSolutions] = useState<NASAItemDetails[]>([]);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const playerIdRef = useRef<string>('');
  const confettiFiredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!roomCode) {
      router.push('/join');
      return;
    }

    const savedPlayerId = localStorage.getItem('moon_player_id');
    if (!savedPlayerId) {
      router.push(`/join?room=${roomCode}`);
      return;
    }
    playerIdRef.current = savedPlayerId;

    const fetchResultData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Leaderboard and Session State
        const lbRes = await fetch(`/api/session/${roomCode}/leaderboard`);
        const lbData = await lbRes.json();

        if (lbData.hidden) {
          // If not revealed yet, redirect back to waiting
          router.push(`/waiting?room=${roomCode}`);
          return;
        }

        setLeaderboard(lbData.leaderboard || []);
        setStats(lbData.stats || null);

        // 2. Fetch Expert Solution (now allowed because revealed)
        const solRes = await fetch(`/api/session/${roomCode}/solution`);
        if (solRes.ok) {
          const solData = await solRes.json();
          setExpertSolutions(solData.solutions || []);
        }

        // 3. Find player's submission from leaderboard or direct submission API
        const playerEntry = lbData.leaderboard?.find(
          (e: LeaderboardEntry) => e.player_id === playerIdRef.current
        );

        if (playerEntry) {
          // Check local draft / saved submission for item order
          const localDraftKey = `moon_draft_${roomCode}_${playerIdRef.current}`;
          const localOrderedIds = localStorage.getItem(localDraftKey);
          let orderedIds: string[] = [];
          if (localOrderedIds) {
            try {
              orderedIds = JSON.parse(localOrderedIds);
            } catch {
              // fallback
            }
          }

          setSubmission({
            id: `sub-${playerIdRef.current}`,
            session_id: '',
            player_id: playerIdRef.current,
            ordered_item_ids: orderedIds,
            error_score: playerEntry.error_score,
            survival_score: playerEntry.survival_score,
            status: playerEntry.status,
            variant_id: ((playerEntry.survival_score * 3) % 5) + 1,
            submitted_at: playerEntry.submitted_at,
            display_name: playerEntry.display_name,
            rank: playerEntry.rank,
          });

          // Trigger confetti for SỐNG tier
          if (playerEntry.status === 'SỐNG' && !confettiFiredRef.current) {
            confettiFiredRef.current = true;
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#5EEBFF', '#8B7CFF', '#F43F5E', '#F8D66D'],
            });
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Lỗi tải kết quả.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [roomCode, router]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-300 text-sm">Đang tải báo cáo sinh tồn và bảng xếp hạng...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <p className="text-rose-300 text-sm">{errorMsg || 'Chưa tìm thấy bài nộp của bạn trong phiên này.'}</p>
        <Link href={`/lobby?room=${roomCode}`} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs">
          Quay lại phòng
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[submission.status];
  const memeMessage = getMemeMessage(submission.status, submission.variant_id);

  // Map expert items for fast lookup
  const expertMap = new Map<string, NASAItemDetails>(
    (expertSolutions.length ? expertSolutions : NASA_EXPERT_ITEMS).map((item) => [item.id, item])
  );

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto w-full space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
          // BÁO CÁO NHIỆM VỤ ĐÃ CẬP BẾN
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Kết Quả Sinh Tồn Mặt Trăng
        </h1>
        <p className="text-sm text-slate-300">
          Phi hành gia: <strong className="text-white">{submission.display_name || 'Bạn'}</strong> • Phòng: <span className="font-mono text-cyan-300">{roomCode}</span>
        </p>
      </div>

      {/* Main Score & Meme Card */}
      <div className={`w-full glass-panel-glow p-6 sm:p-8 rounded-3xl relative overflow-hidden border ${statusConfig.glowClass}`}>
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Fixed Cat Meme Image */}
          <div className="relative w-44 sm:w-56 h-44 sm:h-56 flex-shrink-0 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-indigo-500/30 bg-slate-950 p-2 flex items-center justify-center">
              <Image
                src={statusConfig.image}
                alt={`Meme ${submission.status}`}
                width={220}
                height={220}
                className="object-contain max-h-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Scores & Status Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${statusConfig.badgeClass}`}>
                {submission.status === 'SỐNG' && '🟢 '}
                {submission.status === 'SỐNG HẤP HỐI' && '🟡 '}
                {submission.status === 'HẸO' && '🔴 '}
                {submission.status}
              </span>

              {submission.rank && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Hạng #{submission.rank} toàn lớp
                </span>
              )}
            </div>

            {/* Score Numbers */}
            <div className="flex items-baseline justify-center md:justify-start gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Điểm sống sót</p>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-white">
                  {submission.survival_score}
                  <span className="text-xl sm:text-2xl text-slate-400 font-sans font-normal">/100</span>
                </div>
              </div>

              <div className="border-l border-slate-700 pl-4">
                <p className="text-xs text-slate-400 uppercase font-semibold">Độ lệch sai số (E)</p>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-300">
                  {submission.error_score}
                  <span className="text-xs text-slate-500 font-normal"> / 112</span>
                </div>
              </div>
            </div>

            {/* Gen Z Paragraph */}
            <p className="text-slate-200 text-sm leading-relaxed border-t border-slate-800/80 pt-3">
              “{memeMessage.paragraph}”
            </p>

            {/* Bullets status */}
            <div className="flex flex-wrap gap-2 pt-1">
              {memeMessage.bullets.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900/80 border border-slate-700/80 text-cyan-300 font-mono"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Class Statistics Overview */}
      {stats && (
        <div className="w-full glass-panel p-5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">Tổng phi hành gia</p>
            <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{stats.total}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-300">🟢 Sống</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">{stats.songCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-300">🟡 Hấp hối</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">{stats.hapHoiCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-300">🔴 Hẹo</p>
            <p className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-0.5">{stats.heoCount}</p>
          </div>
        </div>
      )}

      {/* Leaderboard Section (Top 10 + You) */}
      <div className="w-full glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> Bảng Xếp Hạng Phi Hành Đoàn ({leaderboard.length} người)
          </h2>
          {leaderboard.length > 10 && (
            <button
              onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              {showFullLeaderboard ? 'Thu gọn Top 10' : 'Xem toàn bộ'}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Hạng</th>
                <th className="py-3 px-3">Phi hành gia</th>
                <th className="py-3 px-3 text-center">Điểm sống sót</th>
                <th className="py-3 px-3 text-center">Độ lệch E</th>
                <th className="py-3 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(showFullLeaderboard ? leaderboard : leaderboard.slice(0, 10)).map((entry, idx) => {
                const isMe = entry.player_id === playerIdRef.current;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-cyan-500/15 border-l-4 border-l-cyan-400 font-semibold text-white'
                        : 'hover:bg-slate-800/30 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold">
                      {entry.rank === 1 && '🥇 '}
                      {entry.rank === 2 && '🥈 '}
                      {entry.rank === 3 && '🥉 '}
                      #{entry.rank}
                    </td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span>{entry.display_name}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-slate-950">
                          BẠN
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-cyan-300">
                      {entry.survival_score}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {entry.error_score}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          STATUS_CONFIG[entry.status]?.badgeClass || ''
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NASA Expert Solutions Comparison Table */}
      <div className="w-full glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Đối Chiếu Chi Tiết Đáp Án Chuyên Gia NASA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            So sánh từng vị trí vật phẩm của bạn với lời giải chính thức từ NASA StarChild và lý do khoa học.
          </p>
        </div>

        <div className="space-y-3">
          {NASA_EXPERT_ITEMS.map((expertItem) => {
            // Find player rank for this item
            const playerIndex = submission.ordered_item_ids?.indexOf(expertItem.id);
            const playerRank = playerIndex !== -1 && playerIndex !== undefined ? playerIndex + 1 : '—';
            const diff =
              typeof playerRank === 'number'
                ? Math.abs(playerRank - expertItem.expertRank)
                : '—';

            return (
              <div
                key={expertItem.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Names and explanation */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {expertItem.nameVi}
                    </span>
                    <span className="text-slate-400 text-xs italic">
                      ({expertItem.nameEn})
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    💡 <strong className="text-slate-300">Giải thích NASA:</strong> {expertItem.explanationVi}
                  </p>
                </div>

                {/* Badges: Your rank vs NASA rank */}
                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Bạn chọn</p>
                    <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                      #{playerRank}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-emerald-400 font-semibold">NASA</p>
                    <span className="px-2.5 py-1 rounded-lg font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      #{expertItem.expertRank}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Lệch</p>
                    <span
                      className={`px-2 py-1 rounded-lg font-mono font-bold ${
                        diff === 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : Number(diff) <= 3
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {diff === 0 ? '✓ 0' : `±${diff}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concluding Script Box (11.2) */}
      <div className="w-full p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1">
        <p className="font-semibold text-slate-300">💡 Lời đúc kết từ Team ChatGPT:</p>
        <p className="italic">
          “Giờ nhìn lại bài của mình thử nhé: món nào bạn tưởng quan trọng nhưng NASA lại xếp rất thấp, và ngược lại? Quá trình nhận ra vấn đề, phân tích dữ kiện và đi đến kết luận chính là điều kỳ diệu của tư duy logic. Cảm ơn bạn đã tham gia nhiệm vụ!”
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 pt-2">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition"
        >
          Trang chủ
        </Link>
        <Link
          href="/join"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-sm font-bold shadow-lg hover:scale-105 transition"
        >
          Chơi phòng khác →
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Đang tải kết quả...</div>}>
      <ResultContent />
    </Suspense>
  );
}
