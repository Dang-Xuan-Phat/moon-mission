import React from 'react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-indigo-500/20 pb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Hướng dẫn chi tiết
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Luật Chơi & Cách Tính Điểm
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Nắm vững quy tắc và cơ chế tính điểm để đưa phi hành đoàn vượt qua 120 km khắc nghiệt trên Mặt Trăng.
          </p>
        </div>

        {/* 4 Core Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyan-400 space-y-2">
            <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              QUY TẮC 01
            </span>
            <h3 className="text-lg font-bold text-white">Chơi Cá Nhân & Nhập Tên</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Mỗi thành viên tham gia độc lập bằng điện thoại hoặc máy tính cá nhân. Không cần đăng ký tài khoản, chỉ cần nhập tên hiển thị và mã phòng do Host cung cấp.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-pink-400 space-y-2">
            <span className="text-pink-400 font-mono text-xs font-bold uppercase tracking-wider">
              QUY TẮC 02
            </span>
            <h3 className="text-lg font-bold text-white">Xếp Đủ 15 Vật Phẩm</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Bạn phải xếp toàn bộ 15 vật phẩm theo thứ tự từ <strong>1 (Quan trọng nhất)</strong> đến <strong>15 (Ít quan trọng nhất)</strong>. Dùng thao tác kéo-thả hoặc nút ⬆️ / ⬇️.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-400 space-y-2">
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              QUY TẮC 03
            </span>
            <h3 className="text-lg font-bold text-white">Đồng Hồ 10:00 Phút Chuẩn Server</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tất cả thiết bị đếm ngược cùng lúc theo thời gian thực của máy chủ. Hệ thống tự động lưu bản nháp liên tục. Hết 10 phút, hệ thống sẽ tự động chốt bài thi.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-400 space-y-2">
            <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              QUY TẮC 04
            </span>
            <h3 className="text-lg font-bold text-white">Bảo Mật Đáp Án Tuyệt Đối</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Điểm số và đáp án chuẩn NASA được tính toán trên máy chủ bảo mật. Sau khi Host tuyên bố công bố, kết quả cá nhân và bảng xếp hạng cả lớp mới đồng loạt xuất hiện.
            </p>
          </div>
        </div>

        {/* Scoring Formula */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📐</span> Công Thức Chấm Điểm Chuẩn NASA
          </h2>
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs sm:text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-1">// Bước 1: Tính tổng sai lệch tuyệt đối (Error Score E)</p>
              <p className="text-cyan-300 font-bold text-sm sm:text-base">
                E = Σ |playerRank(món_i) - expertRank(món_i)|
              </p>
              <p className="text-slate-400 text-xs mt-1">Khoảng giá trị của E từ 0 (hoàn hảo) đến 112 (đối lập hoàn toàn).</p>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <p className="text-slate-400 text-xs mb-1">// Bước 2: Quy đổi về thang điểm 0 - 100</p>
              <p className="text-emerald-400 font-bold text-sm sm:text-base">
                SURVIVAL_SCORE = Math.round(100 × (112 - E) / 112)
              </p>
            </div>
          </div>

          {/* Test cases table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Ví dụ kiểm thử thuật toán:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Trường hợp</th>
                    <th className="p-3 border-b border-slate-800">Mô tả thứ tự</th>
                    <th className="p-3 border-b border-slate-800">Điểm lệch E</th>
                    <th className="p-3 border-b border-slate-800">Điểm sống sót</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-emerald-400">Đúng toàn bộ</td>
                    <td className="p-3">Giống hệt 100% chuyên gia NASA</td>
                    <td className="p-3 font-mono">0</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">100 điểm</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-amber-400">Đảo cặp kế tiếp</td>
                    <td className="p-3">Lệch nhẹ từng cặp (2-1, 4-3, 6-5...)</td>
                    <td className="p-3 font-mono">14</td>
                    <td className="p-3 font-mono font-bold text-amber-400">88 điểm</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-rose-400">Đảo ngược hoàn toàn</td>
                    <td className="p-3">Xếp ngược 180° từ 15 về 1</td>
                    <td className="p-3 font-mono">112</td>
                    <td className="p-3 font-mono font-bold text-rose-400">0 điểm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3 Status tiers */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🐱</span> Ba Mức Trạng Thái Sinh Tồn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">
                70 – 100 ĐIỂM
              </span>
              <h3 className="text-lg font-bold text-emerald-300">🟢 SỐNG</h3>
              <p className="text-xs text-slate-300">
                Linh vật: <em>Mèo thumbs up</em>. Tư duy logic sắc bén, nắm chắc các nhu cầu sinh tồn tối thượng.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300">
                40 – 69 ĐIỂM
              </span>
              <h3 className="text-lg font-bold text-amber-300">🟡 SỐNG HẤP HỐI</h3>
              <p className="text-xs text-slate-300">
                Linh vật: <em>Mèo suy tư</em>. Có chiến lược nhưng trực giác đôi khi đi đường vòng, cần trạm điều khiển hỗ trợ.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300">
                0 – 39 ĐIỂM
              </span>
              <h3 className="text-lg font-bold text-rose-300">🔴 HẸO</h3>
              <p className="text-xs text-slate-300">
                Linh vật: <em>Mèo nổ tung</em>. Lối chơi mang phong cách tự do tuyệt đối, bản lĩnh cao nhưng bay khỏi quỹ đạo!
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/join"
            className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 shadow-lg hover:scale-105 transition-all"
          >
            Đã hiểu luật! Tham gia phòng chơi ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
