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
            <span>🧠</span>  Thử Thách Cách Bạn Tư Duy
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <em>“Nhiệm vụ Mặt Trăng”</em> không chỉ yêu cầu người chơi xếp hạng 15 vật phẩm. Mỗi lựa chọn đều đòi hỏi phân tích tình huống, 
            so sánh phương án, kết nối thông tin và dự đoán kết quả. Khi đối chiếu với phương án tham khảo, người chơi có thể nhận ra 
            cách mình hình thành quyết định, kiểm tra lại suy luận và điều chỉnh chiến lược khi những giả định ban đầu không còn phù hợp.
          </p>
          <blockquote className="border-l-4 border-cyan-400 pl-4 py-1 text-cyan-200 italic text-sm">
            “Điều quan trọng không chỉ là bạn chọn gì, mà là bạn đã suy nghĩ như thế nào để đi đến lựa chọn đó.”
          </blockquote>
        </div>

        {/* Links to original sources (without spoiling the solution) */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔗</span> Liên Kết Tài Liệu Khoa Học
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
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
