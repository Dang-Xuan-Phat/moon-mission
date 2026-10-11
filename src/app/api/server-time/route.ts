import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    serverTime: Date.now(),
    iso: new Date().toISOString(),
  });
}
