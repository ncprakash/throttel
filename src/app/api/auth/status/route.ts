import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/mockStore';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session',
      });
    }

    const user = getUserFromSession(token);

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Session expired',
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Session active',
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        message: 'Unable to verify session',
      },
      { status: 401 },
    );
  }
}

