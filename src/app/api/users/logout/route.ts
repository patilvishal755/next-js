import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Login Success', success: true },
      { status: 200 },
    );
    response.cookies.set('token', '', {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
