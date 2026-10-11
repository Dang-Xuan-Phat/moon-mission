import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const session = await SessionManager.getSession(code);

    if (!session) {
      return NextResponse.json({ error: 'Không tìm thấy phòng chơi.' }, { status: 404 });
    }

    return NextResponse.json({
      session,
      serverTime: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lấy thông tin phòng.' }, { status: 500 });
  }
}
