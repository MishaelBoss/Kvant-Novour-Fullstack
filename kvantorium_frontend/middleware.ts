import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/kvantumid/:path*'],
};

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;
    const homeUrl = new URL('/', request.url);

    if (!accessToken) {
        return NextResponse.redirect(homeUrl);
    }

    try {
        const payload = jose.decodeJwt(accessToken);

        if (pathname.startsWith('/admin')) {
            const isAdmin = payload.is_admin === true;

            if (!isAdmin) {
                return NextResponse.redirect(homeUrl);
            }
        }
    } catch (error) {
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}
