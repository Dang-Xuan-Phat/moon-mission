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
    const expectedPassword = process.env.ADMIN_PASSWORD || '02092007';

    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Mật khẩu quản trị viên không chính xác.' }, { status: 401 });
    }

    const csvContent = await SessionManager.exportCSV(session.id);
    const filename = `NhiemVuMatTrang_${code}_${new Date().toISOString().slice(0, 10)}.csv`;

    // Add UTF-8 BOM so Excel opens Vietnamese characters perfectly!
    const bom = '\uFEFF';
    return new NextResponse(bom + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xuất file CSV.' }, { status: 500 });
  }
}
