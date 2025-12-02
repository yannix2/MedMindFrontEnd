import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Auth routes
  const authRoutes = ['/signin', '/signup', '/forgot-password']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // For protected routes, we'll let the client-side handle authentication
  // The API calls will fail if cookies are invalid
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
    '/forgot-password',
    '/profile/:path*',
    '/settings/:path*',
  ],
}