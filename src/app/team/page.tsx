import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-indigo-500/20 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative p-3 bg-[#0B1026] rounded-2xl border border-pink-500/40">
              <Image
                src="/assets/team-chatgpt-logo.png"
                alt="Logo Team ChatGPT"
                width={88}
                height={88}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Dự án học phần • Trải nghiệm thực tế
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-1">
              TEAM CHATGPT
            </h1>
          </div>
        </div>

        {/* Disclaimer card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <strong className="text-slate-200">Ghi chú xác thực thương hiệu:</strong>
            <p className="mt-0.5">
              “Team ChatGPT” là tên định danh nhóm học tập của chúng mình cho bài tập này. Logo hình hoa sen cách điệu hồng là biểu trưng riêng của đội, hoàn toàn không liên quan, không sở hữu và không giả mạo các tổ chức chính thức như OpenAI hay NASA.
            </p>
          </div>
        </div>

        {/* Vision statement */}
        <div className="glass-panel p-6 rounded-2xl space-y-3 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎯</span> Mục Tiêu Của Dự Án
          </h3>
          <p>
            Dự án được xây dựng với mục tiêu chuyển hóa một bài tập lý thuyết hàn lâm thành một trải nghiệm sống động: cả lớp cùng tham gia, cùng suy nghĩ dưới áp lực thời gian, và cùng đối chiếu kết quả trong tiếng cười sảng khoái với những dòng meme hóm hỉnh.
          </p>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/join"
            className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 shadow-lg hover:scale-105 transition-all"
          >
            Tham gia phòng thi đấu ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
