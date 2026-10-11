import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || '02092007';

    if (password && password === expectedPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Mật khẩu quản trị viên không chính xác.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Lỗi xác thực hệ thống.' }, { status: 500 });
  }
}
