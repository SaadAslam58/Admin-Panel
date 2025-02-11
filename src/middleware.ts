import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
const secretKey =  new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;
  console.log('AuthToken:', authToken);

  try {
    if (authToken) {
      await jwtVerify(authToken, secretKey);
      if (request.nextUrl.pathname === '/') {
        console.log('Redirecting to /Order');
        return NextResponse.redirect(new URL('/Dashboard', request.url));
      }
    }
  } catch (error) {
    console.log('Invalid or expired token:', error);
  }

  if (!authToken && request.nextUrl.pathname === '/Dashboard') {
    console.log('Redirecting to /');
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/', '/Dashboard'],
};
