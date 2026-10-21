'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GAME_ITEMS } from '@/constants/items';
import { GameItem, SessionData } from '@/types/game';
import { supabase } from '@/lib/supabase/client';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room')?.toUpperCase() || '';

  // State
  const [items, setItems] = useState<GameItem[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const playerIdRef = useRef<string>('');
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStatusPollRef = useRef<NodeJS.Timeout | null>(null);
  const serverOffsetRef = useRef<number>(0);
  const endTimeRef = useRef<number | null>(null);

  // 1. Initialize Player & Session & Items
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

    // Load initial items or restore draft
    const initializeGame = async () => {
      try {
        // Fetch server time and calculate clock offset
        const timeRes = await fetch('/api/server-time');
        const timeData = await timeRes.json();
        const clientNow = Date.now();
        serverOffsetRef.current = timeData.serverTime - clientNow;

        // Fetch session
        const sessionRes = await fetch(`/api/session/${roomCode}`);
        if (!sessionRes.ok) throw new Error('Không thể kết nối phòng.');
        const { session }: { session: SessionData } = await sessionRes.json();

        if (session.status === 'LOBBY' || session.status === 'COUNTDOWN') {
          router.push(`/lobby?room=${roomCode}`);
          return;
        }

        if (session.status === 'RESULTS') {
          router.push(`/result?room=${roomCode}`);
          return;
        }

        // Set End Time
        if (session.end_at) {
          endTimeRef.current = new Date(session.end_at).getTime();
        } else {
          endTimeRef.current = Date.now() + 600 * 1000;
        }

        // Try restoring draft from server
        const draftRes = await fetch(`/api/session/${roomCode}/draft?playerId=${playerIdRef.current}`);
        const draftData = await draftRes.json();

        if (draftData.draft && Array.isArray(draftData.draft) && draftData.draft.length === 15) {
          const itemMap = new Map(GAME_ITEMS.map((item) => [item.id, item]));
          const restored = draftData.draft
            .map((id: string) => itemMap.get(id))
            .filter(Boolean) as GameItem[];

          if (restored.length === 15) {
            setItems(restored);
            return;
          }
        }

        // Check local storage draft backup
        const localDraftKey = `moon_draft_${roomCode}_${playerIdRef.current}`;
        const localDraft = localStorage.getItem(localDraftKey);
        if (localDraft) {
          try {
            const parsedIds = JSON.parse(localDraft);
            if (Array.isArray(parsedIds) && parsedIds.length === 15) {
              const itemMap = new Map(GAME_ITEMS.map((item) => [item.id, item]));
              const restored = parsedIds
                .map((id: string) => itemMap.get(id))
                .filter(Boolean) as GameItem[];
              if (restored.length === 15) {
                setItems(restored);
                return;
              }
            }
          } catch {
            // fallback
          }
        }

        // Shuffle uniquely for each player on start
        const shuffled = [...GAME_ITEMS].sort(() => Math.random() - 0.5);
        setItems(shuffled);
      } catch (err: any) {
        setErrorMsg(err.message || 'Lỗi khởi tạo màn chơi.');
      }
    };

    initializeGame();
  }, [roomCode, router]);

  // 2. Synchronized Countdown Timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!endTimeRef.current) return;

      const currentServerTime = Date.now() + serverOffsetRef.current;
      const diffMs = endTimeRef.current - currentServerTime;
      const secondsLeft = Math.max(0, Math.floor(diffMs / 1000));

      setTimeLeftSeconds(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        handleAutoLockAndSubmit();
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // 3. Status Polling (Watch for host action like reveal or lock)
  useEffect(() => {
    sessionStatusPollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/session/${roomCode}`);
        if (!res.ok) return;
        const data = await res.json();
        const s: SessionData = data.session;

        if (s.status === 'RESULTS') {
          router.push(`/result?room=${roomCode}`);
        }
      } catch {
        // network silent retry
      }
    }, 6000); // 6s: giảm tải Supabase khi 150 người chơi

    return () => {
      if (sessionStatusPollRef.current) clearInterval(sessionStatusPollRef.current);
    };
  }, [roomCode, router]);

  // 4. Autosave Debounced
  const triggerAutosave = useCallback(
    (newItems: GameItem[]) => {
      if (!playerIdRef.current || newItems.length !== 15) return;

      const itemIds = newItems.map((item) => item.id);
      localStorage.setItem(`moon_draft_${roomCode}_${playerIdRef.current}`, JSON.stringify(itemIds));

      setSaveStatus('saving');

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      autosaveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/session/${roomCode}/draft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerId: playerIdRef.current,
              orderedItemIds: itemIds,
            }),
          });

          if (res.ok) {
            setSaveStatus('saved');
          } else {
            setSaveStatus('error');
          }
        } catch {
          setSaveStatus('error');
        }
      }, 1500); // 1.5s debounce: tránh burst write khi nhiều người kéo cùng lúc
    },
    [roomCode]
  );

  // 5. Reorder logic
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
    triggerAutosave(newItems);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setItems(newItems);
    triggerAutosave(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // 6. Submit logic
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const itemIds = items.map((i) => i.id);
      const res = await fetch(`/api/session/${roomCode}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: playerIdRef.current,
          orderedItemIds: itemIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nộp bài thất bại.');
      }

      router.push(`/waiting?room=${roomCode}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gửi báo cáo.');
      setIsSubmitting(false);
    }
  };

  const handleAutoLockAndSubmit = async () => {
    try {
      const itemIds = items.map((i) => i.id);
      await fetch(`/api/session/${roomCode}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: playerIdRef.current,
          orderedItemIds: itemIds,
        }),
      });
      router.push(`/waiting?room=${roomCode}`);
    } catch {
      router.push(`/waiting?room=${roomCode}`);
    }
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto w-full">
      {/* Sticky Top Status & Timer Bar */}
      <div className="sticky top-20 z-20 w-full mb-6">
        <div className="glass-panel-glow px-4 py-3 rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-xl border border-cyan-400/30">
          {/* Mission info */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <p className="text-xs text-slate-400 font-mono leading-none">Phòng: {roomCode}</p>
              <p className="text-xs sm:text-sm font-bold text-white leading-none mt-1">Xếp hạng 15 món</p>
            </div>
          </div>

          {/* Autosave status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
            {saveStatus === 'saving' && (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Đang đồng bộ lựa chọn…
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Đã tự lưu nháp
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Tín hiệu Trái Đất lag, đang thử lại…
              </span>
            )}
          </div>

          {/* Synced Countdown Clock */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 sm:px-4 py-1.5 rounded-xl font-mono font-black text-lg sm:text-2xl tracking-wider flex items-center gap-2 shadow-inner ${
                timeLeftSeconds <= 60
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                  : timeLeftSeconds <= 180
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              }`}
            >
              <span>⏱️</span>
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Quick Submit CTA */}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>

      {/* Narrative hint banner */}
      <div className="w-full mb-4 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <p className="truncate">
          👉 <strong className="text-cyan-300">Kéo thả</strong> hoặc bấm nút <strong className="text-white">⬆️ / ⬇️</strong> để đổi vị trí. Số 1 là quan trọng nhất!
        </p>
        <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
          {items.length}/15 vật phẩm
        </span>
      </div>

      {errorMsg && (
        <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* 15 Drag-and-Drop Ranking Item Cards */}
      <div className="w-full space-y-2.5">
        {items.map((item, index) => {
          const rankNumber = index + 1;
          const isTop3 = rankNumber <= 3;
          const isBottom3 = rankNumber >= 13;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 select-none ${
                draggedIndex === index
                  ? 'opacity-40 border-cyan-400 bg-cyan-950/40 scale-[0.98]'
                  : 'glass-panel hover:bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              } ${
                isTop3
                  ? 'border-l-4 border-l-cyan-400'
                  : isBottom3
                  ? 'border-l-4 border-l-rose-400/80'
                  : 'border-l-4 border-l-indigo-500/40'
              }`}
            >
              {/* Rank Badge & Item Names */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Drag Handle & Rank Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm sm:text-base flex-shrink-0 shadow-md ${
                    isTop3
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-cyan-500/20'
                      : isBottom3
                      ? 'bg-slate-800 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  {rankNumber}
                </div>

                {/* Names: Vietnamese and original English in parenthesis */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
                    {item.nameVi}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5 italic">
                    ({item.nameEn})
                  </p>
                </div>
              </div>

              {/* Action Buttons: Up/Down for Mobile (≥44px touch friendly) */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-20 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95 transition"
                  aria-label="Di chuyển lên"
                >
                  <span className="text-base font-bold">▲</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-20 text-slate-200 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95 transition"
                  aria-label="Di chuyển xuống"
                >
                  <span className="text-base font-bold">▼</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Button Card */}
      <div className="w-full mt-8 p-6 glass-panel-glow rounded-2xl text-center space-y-3">
        <p className="text-xs text-slate-300">
          Hãy kiểm tra kỹ thứ tự trước khi nộp. Báo cáo sẽ được đối chiếu trực tiếp với đáp án chuyên gia NASA.
        </p>
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_rgba(244,63,94,0.8)] hover:scale-105 active:scale-95 transition"
        >
          {isSubmitting ? 'Đang gửi báo cáo...' : '🚀 Hoàn Tất & Nộp Bài Ngay'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-5 border border-cyan-400/40 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="text-4xl">🛰️</span>
              <h3 className="text-xl font-black text-white">Xác Nhận Nộp Báo Cáo?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sau khi nộp, bạn sẽ không thể chỉnh sửa lại thứ tự 15 vật phẩm này. Hệ thống sẽ ghi nhận và chờ lệnh công bố từ Host.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition"
              >
                Xem lại bài
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition"
              >
                Đồng ý nộp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Đang tải phòng thi...</div>}>
      <PlayContent />
    </Suspense>
  );
}
