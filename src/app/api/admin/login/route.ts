import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createAdminSession, createSession } from '@/lib/mockStore';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = authenticateUser(email, password);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { ok: false, error: 'You are not authorized to access the admin console' },
        { status: 401 },
      );
    }

    const sessionToken = createSession(user);
    const adminToken = createAdminSession(user);

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Admin session established',
    });

    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 6,
    });

    response.cookies.set('admin-token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Unable to start admin session' },
      { status: 500 },
    );
  }
}

