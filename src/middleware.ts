import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const role = req.cookies.get("role")?.value;

    // Allow access to the home page
    if (url.pathname === '/') {
        return NextResponse.next();
    }

    // If no role (user not logged in), store the original path and redirect to login
    if (!role) {
        const loginUrl = new URL('/', req.url);
        loginUrl.searchParams.set('redirect', url.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Handle /l&d routes - only Admins can access
    if (url.pathname.startsWith('/l&d') && role !== "Admin") {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle /employee routes - both Admin and User can access
    if (url.pathname.startsWith('/employee') && (role !== "Admin" && role !== "user")) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/l&d/:path*', '/employee/:path*'],
};
