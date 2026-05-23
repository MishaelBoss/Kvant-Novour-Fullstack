import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/kvantumid/:path*', '/kvanto_form/:path*'],
};

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;
    const homeUrl = new URL('/', request.url);

    if (!accessToken) {
        return NextResponse.redirect(homeUrl);
    }

    try {
        const payload = jose.decodeJwt(accessToken);

        const isAdmin = payload.is_admin === true;
        const isTeacher = payload.is_teacher === true;

        if (pathname.startsWith('/kvanto_form')) {
            const restrictedPaths = [
                '/kvanto_form/new',
                '/kvanto_form/edit'
            ];
            
            const isRestrictedPath = restrictedPaths.some(restricted => 
                pathname === restricted  ||pathname.startsWith(restricted + '/')
            );
            
            const responsesPattern = /^\/kvanto_form\/[^\/]+\/responses(\/|$)/;
            const isResponsesPath = responsesPattern.test(pathname);
            
            const needsAdminOrTeacher = isRestrictedPath || isResponsesPath;
            
            if (needsAdminOrTeacher && !isAdmin && !isTeacher) {
                return NextResponse.redirect(homeUrl);
            }
        }

        if (pathname.startsWith('/admin') && !isAdmin) {
            return NextResponse.redirect(homeUrl);
        }
    } catch (error) {
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}
