import axios from "axios";
import { ApiError } from "./errors/ApiError";

export const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
}

function getCsrfToken(): string {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (!axios.isAxiosError(error)) {
            if (error instanceof Error) {
                return Promise.reject(new ApiError(`Системная ошибка: ${error.message}`));
            }
            return Promise.reject(new ApiError('Произошла неизвестная ошибка'));
        }
        
        const status = error.response?.status;
        const serverData = error.response?.data;

        const isAuthRoute = [
            '/token/refresh/', 
            '/login/', 
            '/register/', 
            '/is_authenticated/', 
            '/logout/'
        ].some(url => originalRequest.url?.includes(url));

        if (status === axios.HttpStatusCode.Unauthorized && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                }).then(() => {
                    originalRequest.headers['X-CSRFToken'] = getCsrfToken();
                    return apiClient(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post('/token/refresh/', {
                    headers: { 
                        'X-CSRFToken': getCsrfToken() 
                    }
                });

                processQueue(null);
                originalRequest.headers['X-CSRFToken'] = getCsrfToken();
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                if (typeof window !== 'undefined') window.dispatchEvent(new Event('fetchUser'));

                return Promise.reject(new ApiError('Сессия истекла. Войдите заново', axios.HttpStatusCode.Unauthorized, serverData));
            } finally {
                isRefreshing = false;
            }
        }

        let parsedMessage = '';
        if (serverData && typeof serverData === 'object') {
            const firstError = 
                serverData.username?.[0] || 
                serverData.email?.[0] || 
                serverData.password?.[0] || 
                serverData.non_field_errors?.[0] ||
                serverData.message;

            if (firstError) parsedMessage = firstError;
            else {
                const errorValues = Object.values(serverData).flat() as unknown[];
                if (errorValues.length > 0 && typeof errorValues[0] === 'string') parsedMessage = errorValues[0];
            }
        }

        const finalMessage = parsedMessage || error.message || 'Ошибка сети';

        switch (status) {
            case axios.HttpStatusCode.Unauthorized: // 401
                console.warn('Сессия истекла. Перенаправление...');
                return Promise.reject(new ApiError('Сессия истекла. Войдите заново', status, serverData));
            case axios.HttpStatusCode.BadRequest: // 400
                return Promise.reject(new ApiError(finalMessage || 'Ошибка валидации данных', status, serverData));
            case axios.HttpStatusCode.Forbidden: // 403
                return Promise.reject(new ApiError('У вас нет прав для этого действия', status, serverData));
            case axios.HttpStatusCode.NotFound: // 404
                return Promise.reject(new ApiError('Такой страницы не существует', status, serverData));
            case axios.HttpStatusCode.InternalServerError: // 500
                return Promise.reject(new ApiError('Сервер временно недоступен. Попробуйте позже', status, serverData));
            default:
                return Promise.reject(new ApiError(finalMessage, status, serverData));
        }
    }
);