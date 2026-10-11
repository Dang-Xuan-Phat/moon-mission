import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-indigo-500/20 pb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Cơ sở lý thuyết & Khoa học
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Về Dự Án & Nguồn Gốc NASA
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Khám phá nguồn gốc học thuật đằng sau bài tập kinh điển được NASA phát triển và các nhà tâm lý học sử dụng rộng rãi suốt hơn 50 năm qua.
          </p>
        </div>

        {/* Origin NASA Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🚀</span> Bối cảnh bài tập “Những vấn đề trong không gian”
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            “Nhiệm vụ Mặt Trăng” sử dụng bối cảnh và bộ 15 vật phẩm của bài tập giáo dục 
            <strong> “Những vấn đề trong không gian” (Problems in Space)</strong> do 
            <strong> NASA StarChild</strong> công bố.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Việc xếp hạng và đối chiếu với phương án chuyên gia giúp người học quan sát cách mình lựa chọn, phán đoán và sắp xếp thứ tự ưu tiên trong một bài toán giả định khi đối mặt với điều kiện môi trường hoàn toàn xa lạ (chân không, nhiệt độ khắc nghiệt, không có khí quyển, trọng lực yếu).
          </p>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
            <strong>⚠️ Lưu ý phương pháp luận:</strong> Đây là hoạt động rèn luyện tư duy và phân tích mô phỏng, KHÔNG phải bài kiểm tra trí thông minh (IQ) hay thang đo tâm lý được chuẩn hóa. Các danh hiệu meme được thiết kế nhằm mục đích giải trí và tạo bầu không khí học tập tích cực.
          </div>
        </div>

        {/* Hall & Watson Study Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧠</span> Nghiên cứu Ra Quyết Định Nhóm (Hall & Watson, 1970)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Năm 1970, hai nhà nghiên cứu Jay Hall và W. H. Watson đã xuất bản công trình đột phá: 
            <em> “The Effects of a Normative Intervention on Group Decision-Making Performance” </em> 
            trên tạp chí Human Relations. Họ đã sử dụng bài tập sinh tồn Mặt Trăng này để chứng minh hiện tượng:
          </p>
          <blockquote className="border-l-4 border-cyan-400 pl-4 py-1 text-cyan-200 italic text-sm">
            “Khi các cá nhân trao đổi và cộng tác đúng phương pháp, quyết định chung của nhóm thường đạt độ chính xác cao hơn điểm số trung bình của từng cá nhân riêng lẻ.”
          </blockquote>
        </div>

        {/* Presenter Scripts */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎙️</span> Kịch Bản Gợi Ý Cho Người Dẫn Chương Trình (MC Script)
          </h2>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-rose-300 uppercase tracking-wide">
              1. Script mở đầu (60 – 90 giây trước khi chơi)
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800 leading-relaxed italic">
              “Trước khi vào phần lý thuyết, team ChatGPT muốn thử một chuyện nhỏ với cả lớp: nếu phải sinh tồn trên Mặt Trăng, mọi người có biết cái gì cần giữ lại đầu tiên không? Tụi mình sẽ cùng chơi một nhiệm vụ dựa trên bài tập của NASA có tên ‘Những vấn đề trong không gian’ (Problems in Space), với đủ 15 vật phẩm và đáp án chuyên gia để đối chiếu. Trong 10 phút, mỗi bạn tự xếp hạng tất cả vật phẩm từ quan trọng nhất đến ít quan trọng nhất. Không có đáp án lộ trước, cũng không phải thi kiến thức chuyên sâu về vũ trụ. Bọn mình muốn mọi người chú ý cách bản thân suy nghĩ, chọn thứ tự ưu tiên và ra quyết định khi gặp một tình huống lạ. Chơi xong web sẽ chấm điểm, bật BXH và trả kết quả rất... có cá tính. Mời mọi người quét mã QR, nhập tên và chờ bắt đầu cùng lúc nha!”
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
              2. Script chốt sau game (sau khi mở kết quả)
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800 leading-relaxed italic">
              “Giờ nhìn lại bài của mình thử nhé: món nào mọi người tưởng quan trọng nhưng NASA lại xếp rất thấp, và ngược lại? Lúc đưa ra quyết định, bạn dựa vào điều đã biết, suy luận từ môi trường Mặt Trăng, hay đơn giản là cảm giác? Chính quá trình nhận ra vấn đề, phân tích dữ kiện, so sánh khả năng và đi đến kết luận là điều tụi mình muốn kết nối với bài học về tư duy. Còn mấy status meme thì chỉ để vui thôi nha, không phải nhận xét IQ của ai đâu!”
            </p>
          </div>
        </div>

        {/* Links to original sources */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔗</span> Liên Kết Tài Liệu Gốc Trực Tiếp
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <a
              href="https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/problems_space.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
            >
              <span>NASA StarChild: Problems in Space</span>
              <span>↗</span>
            </a>
            <a
              href="https://starchild.gsfc.nasa.gov/docs/StarChild/space_level2/problems_space_solution.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
            >
              <span>NASA StarChild: Experts' Solution</span>
              <span>↗</span>
            </a>
            <a
              href="https://journals.sagepub.com/doi/10.1177/001872677002300404"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
            >
              <span>Hall & Watson (1970) Paper</span>
              <span>↗</span>
            </a>
            <a
              href="https://www.psychologicalscience.org/observer/nasa-exercise"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
            >
              <span>APS: NASA Ranking Exercise</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center pt-4">
          <Link
            href="/join"
            className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 shadow-lg hover:scale-105 transition-all"
          >
            Sẵn sàng rồi? Vào phòng chơi ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
