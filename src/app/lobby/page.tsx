'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { SessionData } from '@/types/game';

function LobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room')?.toUpperCase() || '';

  const [session, setSession] = useState<SessionData | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('moon_player_name') || 'Phi hành gia';
    setPlayerName(savedName);

    if (!roomCode) {
      router.push('/join');
      return;
    }

    // Fetch session initial state and poll
    const checkState = async () => {
      try {
        const res = await fetch(`/api/session/${roomCode}`);
        if (!res.ok) {
          if (res.status === 404) {
            setErrorMsg('Phòng không tồn tại.');
          }
          return;
        }

        const data = await res.json();
        const currentSession: SessionData = data.session;
        setSession(currentSession);
        setPlayerCount(currentSession.player_count || 1);

        // Check if host started the game
        if (currentSession.status === 'RUNNING') {
          router.push(`/play?room=${roomCode}`);
        } else if (currentSession.status === 'RESULTS') {
          router.push(`/result?room=${roomCode}`);
        } else if (currentSession.status === 'COUNTDOWN' && currentSession.start_at) {
          const diff = Math.max(0, Math.floor((new Date(currentSession.start_at).getTime() - Date.now()) / 1000));
          setCountdownSeconds(diff);
          if (diff <= 0) {
            router.push(`/play?room=${roomCode}`);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    checkState();
    pollIntervalRef.current = setInterval(checkState, 5000);

    // Báo server khi user thoát trang — dùng sendBeacon vì fetch không đáng tin cậy lúc unload
    const playerId = sessionStorage.getItem('moon_player_id') || localStorage.getItem('moon_player_id');
    const handleUnload = () => {
      if (!playerId || !roomCode) return;
      const blob = new Blob([JSON.stringify({ playerId })], { type: 'application/json' });
      navigator.sendBeacon(`/api/session/${roomCode}/leave`, blob);
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [roomCode, router]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/join?room=${roomCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            SẢNH CHỜ KHỞI HÀNH • PHÒNG {roomCode}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Trạm Điều Khiển Mặt Trăng
          </h1>
          <p className="text-sm text-cyan-200">
            {countdownSeconds !== null && countdownSeconds > 0
              ? 'Trạm điều khiển sắp mở nhiệm vụ. Chuẩn bị não bộ nha!'
              : 'Đang đồng bộ phi hành đoàn… Chờ lệnh từ Host.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Countdown Box if Scheduled */}
        {countdownSeconds !== null && countdownSeconds > 0 && (
          <div className="glass-panel p-6 rounded-2xl text-center border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(94,235,255,0.2)]">
            <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">
              ĐẾM NGƯỢC GIỜ XUẤT PHÁT
            </p>
            <div className="text-5xl font-black font-mono text-cyan-300 tracking-wider">
              00:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
            </div>
          </div>
        )}

        {/* Main Lobby Card */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6">
          {/* Astronaut Profile info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md">
                🧑‍🚀
              </div>
              <div>
                <p className="text-xs text-slate-400">Phi hành gia</p>
                <p className="text-base font-bold text-white">{playerName}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Đã sẵn sàng
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Mã phòng: <strong className="text-white font-mono">{roomCode}</strong></p>
            </div>
          </div>

          {/* Realtime Astronaut count badge */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold">
              <span className="text-xl">👥</span>
              <span>Phi hành đoàn trực tuyến:</span>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {playerCount} <span className="text-xs font-normal text-slate-400">người</span>
            </div>
          </div>

          {/* QR Code and Share link */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-2.5 bg-white rounded-xl border border-cyan-400 shadow-md flex-shrink-0 flex items-center justify-center">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? `${window.location.origin}/join?room=${roomCode}` : `https://moon-mission.vercel.app/join?room=${roomCode}`}
                size={120}
                bgColor="#FFFFFF"
                fgColor="#070B1A"
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mời bạn bè & Lớp học
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quét mã QR bằng điện thoại hoặc chia sẻ liên kết trực tiếp để vào cùng phòng.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/40 text-xs font-bold text-white transition active:scale-95"
              >
                <span>{copied ? '✓ Đã sao chép liên kết!' : '📋 Sao chép liên kết phòng'}</span>
              </button>
            </div>
          </div>

          {/* Mission tips */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">⚡ Nhắc nhở trước giờ xuất phát:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bạn có 10 phút để sắp xếp 15 vật phẩm theo thứ tự ưu tiên.</li>
              <li>Có thể kéo-thả hoặc dùng nút mũi tên ⬆️ ⬇️ trên màn hình điện thoại.</li>
              <li>Hệ thống tự động lưu lựa chọn liên tục.</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link href="/join" className="text-xs text-slate-400 hover:text-white transition">
            ← Rời phòng / Đổi tên
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Đang tải sảnh chờ...</div>}>
      <LobbyContent />
    </Suspense>
  );
}
