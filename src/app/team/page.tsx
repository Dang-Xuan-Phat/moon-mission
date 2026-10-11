import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TeamPage() {
  const members = [
    {
      name: 'Thành viên 01',
      role: 'Trưởng nhóm / Thuyết trình',
      desc: 'Phụ trách dẫn dắt kịch bản thuyết trình, tương tác trực tiếp với khán giả và điều phối dự án.',
      badge: 'Team Lead',
      avatarBg: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Thành viên 02',
      role: 'Nghiên cứu Nội dung & NASA',
      desc: 'Tìm hiểu tài liệu NASA StarChild, biên soạn cơ sở lý thuyết ra quyết định nhóm và đối chiếu đáp án.',
      badge: 'Research',
      avatarBg: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Thành viên 03',
      role: 'Phát triển Kỹ thuật & Game',
      desc: 'Triển khai hệ thống Next.js, thuật toán tính điểm server-side, phòng chơi đồng thời và giao diện người dùng.',
      badge: 'Tech & Dev',
      avatarBg: 'from-indigo-500 to-purple-600',
    },
    {
      name: 'Thành viên 04',
      role: 'Thiết kế Trải nghiệm & Meme',
      desc: 'Sáng tạo 15 phiên bản cà khịa Gen Z, biên tập hình ảnh meme linh vật mèo và thiết kế slide thuyết trình.',
      badge: 'UI/UX & Content',
      avatarBg: 'from-amber-500 to-pink-500',
    },
  ];

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
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              Nhóm sinh viên thực hiện đồ án thuyết trình đa phương tiện kết hợp tâm lý học, công nghệ số và gamification tương tác trực tiếp.
            </p>
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

        {/* Member list */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👥</span> Thành Viên Đội Ngũ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((m, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-indigo-500/20 hover:border-pink-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{m.name}</h3>
                      <p className="text-xs text-cyan-300">{m.role}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
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
