import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const body = await req.json();
    const { action, adminPassword, scheduledStartTime } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || '02092007';
    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Mật khẩu quản trị viên không chính xác.' }, { status: 401 });
    }

    const updatedSession = await SessionManager.updateSessionControls(
      code,
      action,
      scheduledStartTime
    );

    return NextResponse.json({
      success: true,
      session: updatedSession,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi điều khiển phòng.' }, { status: 400 });
  }
}
