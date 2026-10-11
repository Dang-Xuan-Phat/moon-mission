import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Glowing Badge & Logo */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-3 bg-[#0B1026] rounded-2xl border border-pink-500/30 shadow-2xl">
              <Image
                src="/assets/team-chatgpt-logo.png"
                alt="Logo Team ChatGPT"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            TEAM CHATGPT • DỰ ÁN TÂM LÝ HỌC & RA QUYẾT ĐỊNH
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            NHIỆM VỤ <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-indigo-400">
              MẶT TRĂNG
            </span>
          </h1>
          <p className="text-sm sm:text-base text-cyan-400 font-mono tracking-widest uppercase">
            NASA STARCHILD: PROBLEMS IN SPACE • 150+ PHI HÀNH GIA
          </p>
        </div>

        {/* Narrative Scenario */}
        <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-cyan-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-3">
            <span className="text-base">🚨</span> TÌNH HUỐNG KHẨN CẤP
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Bạn là thành viên phi hành đoàn thám hiểm Mặt Trăng. Tàu gặp sự cố và phải hạ cánh khẩn cấp trên phần Mặt Trăng được chiếu sáng, cách căn cứ khoảng <span className="text-white font-bold">120 km</span>. Tàu bị hư hại và chỉ còn <span className="text-cyan-300 font-bold">15 vật phẩm</span> nguyên vẹn.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-400 gap-2">
            <span>⏱️ Thời gian: <strong className="text-white">10 phút</strong></span>
            <span>🎯 Nhiệm vụ: <strong className="text-white">Xếp hạng 1 → 15</strong></span>
            <span>👥 Quy mô: <strong className="text-white">Toàn bộ lớp học</strong></span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/join"
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.8)] transition-all hover:scale-105 active:scale-95 text-center"
          >
            🚀 Tham Gia Nhiệm Vụ Ngay
          </Link>
          <Link
            href="/rules"
            className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800/80 rounded-2xl transition-all text-center border border-slate-700/60"
          >
            📜 Xem Luật Chơi
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-indigo-300 hover:text-indigo-200 glass-panel hover:bg-indigo-950/40 rounded-2xl transition-all text-center border border-indigo-500/30"
          >
            🛡️ Bảng Điều Khiển Host
          </Link>
        </div>
      </div>
    </div>
  );
}
