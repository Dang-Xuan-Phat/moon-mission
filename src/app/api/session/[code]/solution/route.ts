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

    // ONLY allow access if session is in RESULTS status OR admin requests
    if (session.status !== 'RESULTS' && !session.reveal_at && !isAdmin) {
      return NextResponse.json(
        { error: 'Đáp án chuyên gia chỉ được công bố sau khi host mở kết quả.' },
        { status: 403 }
      );
    }

    const solutions = SessionManager.getExpertSolution();
    return NextResponse.json({
      solutions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lấy đáp án.' }, { status: 500 });
  }
}
