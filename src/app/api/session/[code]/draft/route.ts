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
    const playerId = searchParams.get('playerId');
    if (!playerId) {
      return NextResponse.json({ error: 'Thiếu ID người chơi.' }, { status: 400 });
    }

    const draft = await SessionManager.getDraft(session.id, playerId);
    return NextResponse.json({ draft });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lấy bản nháp.' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const session = await SessionManager.getSession(code);
    if (!session) {
      return NextResponse.json({ error: 'Không tìm thấy phòng.' }, { status: 404 });
    }

    if (session.status !== 'RUNNING') {
      return NextResponse.json({ error: 'Phiên chơi hiện không nhận thay đổi.' }, { status: 400 });
    }

    const body = await req.json();
    const { playerId, orderedItemIds } = body;

    if (!playerId || !Array.isArray(orderedItemIds) || orderedItemIds.length !== 15) {
      return NextResponse.json({ error: 'Dữ liệu xếp hạng không hợp lệ.' }, { status: 400 });
    }

    await SessionManager.saveDraft(session.id, playerId, orderedItemIds);
    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lưu bản nháp.' }, { status: 500 });
  }
}
