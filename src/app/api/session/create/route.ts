import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/store/sessionManager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, isTest, adminPassword } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || '02092007';
    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Mật khẩu quản trị viên không chính xác.' }, { status: 401 });
    }

    const session = await SessionManager.createSession(code, Boolean(isTest));
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi tạo phòng.' }, { status: 400 });
  }
}
