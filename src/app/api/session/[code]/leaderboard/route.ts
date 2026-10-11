import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const session = await SessionManager.getSession(code);
    if (!session) {
      return NextResponse.json({ error: 'Không tìm thấy phòng.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const adminPassword = searchParams.get('adminPassword');
    const isAdmin = adminPassword === (process.env.ADMIN_PASSWORD || 'admin123');

    // Only visible if host revealed or allowed, or if host is checking
    if (!session.leaderboard_visible && session.status !== 'RESULTS' && !isAdmin) {
      return NextResponse.json({
        hidden: true,
        message: 'Đang chờ host công bố kết quả...',
      });
    }

    const leaderboard = await SessionManager.getLeaderboard(session.id);

    // Calculate stats
    const stats = {
      total: leaderboard.length,
      songCount: leaderboard.filter((e) => e.status === 'SỐNG').length,
      hapHoiCount: leaderboard.filter((e) => e.status === 'SỐNG HẤP HỐI').length,
      heoCount: leaderboard.filter((e) => e.status === 'HẸO').length,
      avgScore: leaderboard.length
        ? Math.round(
            leaderboard.reduce((acc, cur) => acc + cur.survival_score, 0) / leaderboard.length
          )
        : 0,
    };

    return NextResponse.json({
      hidden: false,
      leaderboard,
      stats,
      revealAt: session.reveal_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi tải BXH.' }, { status: 500 });
  }
}
