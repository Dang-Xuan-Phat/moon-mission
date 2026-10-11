'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-30 w-full border-b border-indigo-500/20 bg-[#070B1A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform group-hover:scale-105">
              <Image
                src="/assets/team-chatgpt-logo.png"
                alt="Logo Team ChatGPT"
                width={56}
                height={56}
                className="object-contain drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-300">
                TEAM CHATGPT
              </span>
              <span className="text-xs text-cyan-400 font-medium tracking-wider flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                NHIỆM VỤ MẶT TRĂNG
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="/rules"
              className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Luật chơi
            </Link>
            <Link
              href="/team"
              className="text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Đội ngũ
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              Host / Quản trị
            </Link>

            <Link
              href="/join"
              className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_20px_rgba(244,63,94,0.7)] transition-all hover:scale-105 active:scale-95"
            >
              Vào phòng chơi
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/50"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-indigo-500/20 bg-[#0B1026]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-cyan-300 rounded-lg hover:bg-white/5"
          >
            Trang chủ
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-cyan-300 rounded-lg hover:bg-white/5"
          >
            Giới thiệu
          </Link>
          <Link
            href="/rules"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-cyan-300 rounded-lg hover:bg-white/5"
          >
            Luật chơi
          </Link>
          <Link
            href="/team"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-cyan-300 rounded-lg hover:bg-white/5"
          >
            Đội ngũ Team ChatGPT
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-indigo-300 hover:text-indigo-200 rounded-lg hover:bg-white/5"
          >
            Host / Quản trị
          </Link>
          <div className="pt-2">
            <Link
              href="/join"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 rounded-xl shadow-lg"
            >
              🚀 Vào phòng chơi
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
