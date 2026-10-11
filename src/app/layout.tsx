import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';

export const metadata: Metadata = {
  title: 'Nhiệm Vụ Mặt Trăng - Team ChatGPT | Bài Tập Sinh Tồn NASA',
  description:
    'Web game cá nhân xếp hạng 15 vật phẩm sinh tồn trên Mặt Trăng theo bài toán nổi tiếng của NASA StarChild. Thuyết trình tương tác 150+ người.',
  icons: {
    icon: '/assets/team-chatgpt-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full dark">
      <body className="min-h-full flex flex-col bg-[#070B1A] text-slate-100 selection:bg-rose-500 selection:text-white">
        <StarBackground />
        <Navbar />
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
