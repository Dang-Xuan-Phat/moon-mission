import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const body = await req.json();
    const { displayName } = body;

    if (!displayName || typeof displayName !== 'string') {
      return NextResponse.json({ error: 'Vui lòng nhập tên hiển thị hợp lệ.' }, { status: 400 });
    }

    const { player, session } = await SessionManager.joinSession(code, displayName);

    return NextResponse.json({
      success: true,
      player,
      session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi tham gia phòng.' }, { status: 400 });
  }
}
