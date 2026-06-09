import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export const config = {
    matcher: ['/admin-panel/:path*', '/profile/:path*', '/kvantumid/:path*', '/kvanto_form/:path*'],
};

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;
    const homeUrl = new URL('/', request.url);

    if (pathname.startsWith('/kvanto_form')) {
        const requiresAuth = pathname === '/kvanto_form/new' || pathname.startsWith('/kvanto_form/edit') || /^\/kvanto_form\/[^\/]+\/responses/.test(pathname);
        
        if (requiresAuth) {

            if (!accessToken) {
                return NextResponse.redirect(homeUrl);
            }
            
            try {
                const payload = jose.decodeJwt(accessToken);
                const isAdmin = payload.is_admin === true;
                const isTeacher = payload.is_teacher === true;
                
                if (!isAdmin && !isTeacher) {
                    return NextResponse.redirect(homeUrl);
                }
            } catch (error) {
                return NextResponse.redirect(homeUrl);
            }
        }
        
        return NextResponse.next();
    }

    if (!accessToken) {
        return NextResponse.redirect(homeUrl);
    }

    try {
        const payload = jose.decodeJwt(accessToken);
        const isAdmin = payload.is_admin === true;

        if (pathname.startsWith('/admin-panel') && !isAdmin) {
            return NextResponse.redirect(homeUrl);
        }
    } catch (error) {
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}
