import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define protected routes
const protectedRoutes = [
    '/profile',
    '/admin',
    '/manager',
    '/staff',
    '/chef',
    '/checkout',
    '/my-orders',
    '/payment-success',
    '/payment-failed'
];

const adminRoutes = [
    '/admin'
];

const managerRoutes = [
    '/manager'
];

const staffRoutes = [
    '/staff'
];

const chefRoutes = [
    '/chef'
];

const guestOnlyRoutes = [
    '/login',
    '/register'
];

interface JwtPayload {
    r?: string;
    i?: number;
    p?: string;
    m?: string;
    exp: number;
    iat: number;
}

function getTokenFromRequest(request: NextRequest): string | null {
    const tokenFromCookie = request.cookies.get('token')?.value
    if (tokenFromCookie) return tokenFromCookie;

    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    return null;
}

function isTokenValid(token: string): { isValid: boolean; payload: JwtPayload | null } {
    try {
        const payload = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
            return { isValid: false, payload: null };
        }

        return { isValid: true, payload };
    } catch {
        return { isValid: false, payload: null };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') && !pathname.endsWith('/')
    ) {
        return NextResponse.next();
    }

    const token = getTokenFromRequest(request);
    const cookieRole = request.cookies.get('userRole')?.value ?? request.cookies.get('role')?.value;

    // Check authentication status
    const { isValid, payload } = token ? isTokenValid(token) : { isValid: false, payload: null };
    const isAuthenticated = isValid && payload;

    // Redirect authenticated users away from guest-only routes
    if (isAuthenticated && guestOnlyRoutes.some(route => pathname.startsWith(route))) {
        const tokenRole = payload?.r ?? cookieRole ?? '';
        let dashboardUrl = '/';
        if (tokenRole === 'ADMIN') {
            dashboardUrl = '/admin';
        } else if (tokenRole === 'MANAGER') {
            dashboardUrl = '/manager';
        } else if (tokenRole === 'STAFF' || tokenRole === 'Staff') {
            dashboardUrl = '/staff/orders';
        } else if (tokenRole === 'CHEFF') {
            dashboardUrl = '/chef';
        }

        return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (isAuthenticated && payload) {
        const tokenRole = payload.r ?? cookieRole ?? '';

        // Admin routes - admin and manager can access
        if (adminRoutes.some(route => pathname.startsWith(route)) &&
            !['ADMIN', 'MANAGER', 'Admin', 'Manager'].includes(tokenRole)) {
            return NextResponse.redirect(new URL('/403', request.url));
        }

        // Manager routes - admin and manager can access
        if (managerRoutes.some(route => pathname.startsWith(route)) &&
            !['ADMIN', 'MANAGER', 'Admin', 'Manager'].includes(tokenRole)) {
            return NextResponse.redirect(new URL('/403', request.url));
        }

        // Staff routes - only staff can access
        if (staffRoutes.some(route => pathname.startsWith(route)) &&
            !['STAFF', 'Staff'].includes(tokenRole)) {
            return NextResponse.redirect(new URL('/403', request.url));
        }

        // Chef routes - only cheff can access
        if (chefRoutes.some(route => pathname.startsWith(route)) &&
            !['CHEFF', 'Cheff'].includes(tokenRole)) {
            return NextResponse.redirect(new URL('/403', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile',
        '/checkout',
        '/my-orders',
        '/payment-success',
        '/payment-failed',
        '/admin/:path*',
        '/manager/:path*',
        '/staff/:path*',
        '/chef/:path*',
        '/login',
        '/register',
    ],
};