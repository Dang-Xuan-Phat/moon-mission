import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const body = await req.json();
    const { playerId } = body;

    if (!playerId) {
      return NextResponse.json({ error: 'Thiếu ID người chơi.' }, { status: 400 });
    }

    await SessionManager.removePlayer(code, playerId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi rời phòng.' }, { status: 500 });
  }
}
