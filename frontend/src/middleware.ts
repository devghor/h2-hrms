// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { paths } from './constants/paths';

export default async function middleware(req: NextRequest) {
  const session = await auth();

  // If user is not logged in and not already on sign-in page, redirect them
  if (!session && req.nextUrl.pathname !== paths.auth.signIn) {
    const signInUrl = new URL(paths.auth.signIn, req.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (session && req.nextUrl.pathname == paths.auth.signIn) {
    const dashboardUrl = new URL(paths.dashboard, req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
