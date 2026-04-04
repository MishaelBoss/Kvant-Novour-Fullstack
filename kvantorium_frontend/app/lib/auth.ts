import { cookies } from 'next/headers';
import { API_URL } from './api';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        
        const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('jwt')?.value;

        if (!accessToken) {
            console.log("No auth cookie found");
            return null;
        }

        const res = await fetch(`${API_URL}/is_authenticated/`, {
            method: 'GET',
            headers: {
                'Cookie': `access_token=${accessToken}`,
            },
            cache: 'no-store',
        });

        console.log("Auth response status:", res.status);

        if (!res.ok) {
            const text = await res.text();
            console.log("Auth error body:", text);
            return null;
        }

        const data = await res.json();
        return data.is_authenticated ? data : null;
    } catch (error) {
        console.error("Auth check failed:", error);
        return null;
    }
}