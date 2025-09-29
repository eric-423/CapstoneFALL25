import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define protected routes
const protectedRoutes = [
    '/profile',
    '/admin',
    '/manager',
    '/checkout',
    '/payment-result'
];

const adminRoutes = [
    '/admin'
];

const managerRoutes = [
    '/manager'
];

const guestOnlyRoutes = [
    '/login'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();

    // Get authentication token from cookies
    const authToken = cookieStore.get('authToken')?.value;
    const userRole = cookieStore.get('userRole')?.value;

    // Check if user is authenticated
    const isAuthenticated = !!authToken;

    // Redirect authenticated users away from guest-only routes
    if (isAuthenticated && guestOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
        // Redirect to login page
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (userRole !== 'Admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Check manager routes
    if (managerRoutes.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (!['Admin', 'Manager'].includes(userRole || '')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};