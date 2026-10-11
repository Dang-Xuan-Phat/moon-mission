import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const session = await SessionManager.getSession(code);
    if (!session) {
      return NextResponse.json({ error: 'Không tìm thấy phòng chơi.' }, { status: 404 });
    }

    if (session.status === 'ARCHIVED') {
      return NextResponse.json({ error: 'Phiên chơi đã đóng hoàn toàn.' }, { status: 400 });
    }

    const body = await req.json();
    const { playerId, orderedItemIds } = body;

    if (!playerId) {
      return NextResponse.json({ error: 'Thiếu ID người chơi.' }, { status: 400 });
    }

    // Check if player already submitted
    const existingSubmission = await SessionManager.getPlayerSubmission(session.id, playerId);
    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        submission: existingSubmission,
        alreadySubmitted: true,
      });
    }

    let itemsToSubmit = orderedItemIds;
    // If not provided in body, check draft
    if (!Array.isArray(itemsToSubmit) || itemsToSubmit.length !== 15) {
      const draft = await SessionManager.getDraft(session.id, playerId);
      if (draft && draft.length === 15) {
        itemsToSubmit = draft;
      } else {
        return NextResponse.json(
          { error: 'Chưa đủ 15 vật phẩm để nộp bài.' },
          { status: 400 }
        );
      }
    }

    // Server-side scoring and persistence
    const submission = await SessionManager.submitRanking(session.id, playerId, itemsToSubmit);

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi nộp bài.' }, { status: 500 });
  }
}
