'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SessionData } from '@/types/game';

function WaitingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room')?.toUpperCase() || '';

  const [session, setSession] = useState<SessionData | null>(null);
  const [playerName, setPlayerName] = useState<string>('Phi hành gia');
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('moon_player_name');
    if (savedName) setPlayerName(savedName);

    if (!roomCode) {
      router.push('/join');
      return;
    }

    const checkSessionState = async () => {
      try {
        const res = await fetch(`/api/session/${roomCode}`);
        if (!res.ok) return;

        const data = await res.json();
        const currentSession: SessionData = data.session;
        setSession(currentSession);

        // When host reveals results, immediately push to /result
        if (currentSession.status === 'RESULTS') {
          router.push(`/result?room=${roomCode}`);
        }
      } catch (err) {
        console.error('Waiting poll error:', err);
      }
    };

    checkSessionState();
    pollIntervalRef.current = setInterval(checkSessionState, 7000); // 7s: giảm 64% tải Supabase, không ảnh hưởng UX

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [roomCode, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Pulsing Radar Signal Animation */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 radar-glow"></div>
          <div className="absolute inset-4 rounded-full border border-cyan-400/40 animate-ping"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-pink-500/20 border border-cyan-400/60 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(94,235,255,0.4)]">
            🛰️
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            BÁO CÁO ĐÃ TIẾP NHẬN THÀNH CÔNG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Ngồi Chờ NASA Chấm Nha!
          </h1>
          <p className="text-sm text-cyan-200">
            Xin chào <strong>{playerName}</strong>, bài thi của bạn đã được mã hóa an toàn trên máy chủ trạm điều khiển.
          </p>
        </div>

        {/* Card info */}
        <div className="glass-panel-glow p-6 rounded-2xl space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">Mã phòng:</span>
            <span className="font-mono font-bold text-white text-sm">{roomCode}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">Trạng thái:</span>
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Đang đợi phi hành đoàn hoàn tất…
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed italic text-center pt-2">
            “Tuyệt đối không lộ đáp án chuyên gia trước giờ G. Giữ bình tĩnh, lát nữa xem ai là Main Character của Mặt Trăng nhé!”
          </p>
        </div>

        {/* Host action note */}
        <p className="text-xs text-slate-500">
          Màn hình sẽ tự động cập nhật ngay khi Host bấm công bố kết quả.
        </p>
      </div>
    </div>
  );
}

export default function WaitingPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Đang đồng bộ...</div>}>
      <WaitingContent />
    </Suspense>
  );
}
