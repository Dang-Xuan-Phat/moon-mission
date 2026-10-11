'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam) {
      setRoomCode(roomParam.toUpperCase());
    }

    // Restore saved name if available
    const savedName = localStorage.getItem('moon_player_name');
    if (savedName) {
      setDisplayName(savedName);
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCode = roomCode.trim().toUpperCase();
    const cleanName = displayName.trim();

    if (!cleanCode) {
      setErrorMsg('Vui lòng nhập mã phòng.');
      return;
    }
    if (!cleanName) {
      setErrorMsg('Vui lòng nhập tên hiển thị của bạn.');
      return;
    }
    if (cleanName.length > 30) {
      setErrorMsg('Tên hiển thị tối đa 30 ký tự.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/session/${cleanCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: cleanName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Không thể tham gia phòng.');
      }

      // Save credentials for reconnect
      localStorage.setItem('moon_session_code', cleanCode);
      localStorage.setItem('moon_session_id', data.session.id);
      localStorage.setItem('moon_player_id', data.player.id);
      localStorage.setItem('moon_player_name', data.player.display_name);

      // Route according to session status
      if (data.session.status === 'RUNNING') {
        router.push(`/play?room=${cleanCode}`);
      } else if (data.session.status === 'RESULTS') {
        router.push(`/result?room=${cleanCode}`);
      } else {
        router.push(`/lobby?room=${cleanCode}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            // CỔNG GIA NHẬP PHI HÀNH ĐOÀN
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Tham Gia Nhiệm Vụ
          </h1>
          <p className="text-sm text-slate-300">
            Nhập tên và mã phòng 6 ký tự để kết nối với trạm chỉ huy.
          </p>
        </div>

        {/* Join Card */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl relative">
          <form onSubmit={handleJoin} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Mã phòng (Room Code)
              </label>
              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="VD: NASA01"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono text-center text-lg tracking-widest uppercase focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                required
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Nhập mã do Host thông báo hoặc quét từ mã QR trên màn hình chiếu.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Tên phi hành gia (Display Name)
              </label>
              <input
                type="text"
                maxLength={30}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="VD: Hoàng Long"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                required
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Tên sẽ xuất hiện trên Bảng Xếp Hạng của cả lớp.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_25px_rgba(244,63,94,0.7)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Gia Nhập Phòng Chờ</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo button */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setRoomCode('NASA01');
                setDisplayName(`Phi hành gia ${Math.floor(Math.random() * 900 + 100)}`);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
            >
              Điền nhanh phòng mẫu (NASA01)
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Đang tải...</div>}>
      <JoinContent />
    </Suspense>
  );
}
