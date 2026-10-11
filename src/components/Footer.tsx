'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-slate-800/80 bg-[#070B1A]/90 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-300">
                TEAM CHATGPT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Dự án học tập
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Web game tâm lý học thực nghiệm và ra quyết định nhóm dựa trên bài toán kinh điển của NASA.
              Phục vụ lớp học và thuyết trình tương tác trực tiếp với quy mô 150+ người chơi đồng thời.
            </p>
            <p className="mt-3 text-[11px] text-slate-500 italic">
              * “Team ChatGPT” là tên đội thi; không đại diện hay liên kết chính thức với OpenAI hay NASA.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 tracking-wide">
              ĐIỀU HƯỚNG NHANH
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">Trang chủ nhiệm vụ</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">Nguồn gốc & Tài liệu khoa học</Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-cyan-300 transition-colors">Luật chơi & Cách tính điểm</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-300 transition-colors">Bảng điều khiển Host</Link>
              </li>
            </ul>
          </div>

          {/* Academic references */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 tracking-wide">
              NGUỒN KHOA HỌC & CÔNG NGHỆ
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/problems_space.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-slate-300"
                >
                  🚀 NASA StarChild: Problems in Space ↗
                </a>
              </li>
              <li>
                <a
                  href="https://journals.sagepub.com/doi/10.1177/001872677002300404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-slate-300"
                >
                  📄 Hall & Watson (1970): Group Decision Study ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.psychologicalscience.org/observer/nasa-exercise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-slate-300"
                >
                  🧠 APS: NASA Survival Ranking Exercise ↗
                </a>
              </li>
              <li>
                <a
                  href="https://supabase.com/docs/guides/realtime/limits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-slate-300"
                >
                  ⚡ Supabase: Realtime Scalability Specs ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
          <p>© 2026 Team ChatGPT - Nhiệm Vụ Mặt Trăng. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-cyan-400/80">
            Hạ cánh 120km cách căn cứ • 15 Vật phẩm sinh tồn
          </p>
        </div>
      </div>
    </footer>
  );
}
