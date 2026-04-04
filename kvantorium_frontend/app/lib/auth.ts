import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:8000/api';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        
        const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('jwt')?.value;

        if (!accessToken) {
            console.log("No auth cookie found");
            return null;
        }

        const res = await axios.get(`${API_URL}/is_authenticated/`, {
            headers: {
                'Cookie': `access_token=${accessToken}`,
            },
            withCredentials: true,
        });

        if (res.status === 401) {
            console.log("Auth error body:", res.statusText);
            return null;
        }

        const data = await res.data;
        return data.is_authenticated ? data : null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибки:", error.response?.data);
        }
        return null;
    }
}