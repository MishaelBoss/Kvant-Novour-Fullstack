import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export const config = {
    matcher: ['/admin-panel/:path*', '/profile/:path*', '/kvantumid/:path*', '/kvanto_form/:path*'],
};

async function verifyToken(accessToken: string): Promise<jose.JWTPayload | null> {
    const secret = process.env.JWT_SECRET || process.env.DJANGO_SECRET_KEY;
    if (!secret) {
        return jose.decodeJwt(accessToken);
    }
    try {
        const { payload } = await jose.jwtVerify(accessToken, new TextEncoder().encode(secret), {
            algorithms: ['HS256'],
        });
        return payload;
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;
    const homeUrl = new URL('/', request.url);

    if (/^\/profile\/[^\/]+/.test(pathname)) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/kvanto_form')) {
        const requiresAuth = pathname === '/kvanto_form/new' || pathname.startsWith('/kvanto_form/edit') || /^\/kvanto_form\/[^\/]+\/responses/.test(pathname);
        
        if (requiresAuth) {

            if (!accessToken) {
                return NextResponse.redirect(homeUrl);
            }
            
            const payload = await verifyToken(accessToken);
            if (!payload) {
                return NextResponse.redirect(homeUrl);
            }

            const isAdmin = payload.is_admin === true;
            const isTeacher = payload.is_teacher === true;
            
            if (!isAdmin && !isTeacher) {
                return NextResponse.redirect(homeUrl);
            }
        }
        
        return NextResponse.next();
    }

    if (!accessToken) {
        return NextResponse.redirect(homeUrl);
    }

    const payload = await verifyToken(accessToken);
    if (!payload) {
        return NextResponse.redirect(homeUrl);
    }

    const isAdmin = payload.is_admin === true;

    if (pathname.startsWith('/admin-panel') && !isAdmin) {
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}
