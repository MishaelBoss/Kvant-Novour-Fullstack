'use client';
import axios from 'axios';
import { useEffect, useRef } from 'react';

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
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function AxiosConfig() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        axios.defaults.withCredentials = true;
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFToken';
        axios.defaults.baseURL = '/api';

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status !== 401 ||
                    originalRequest._retry ||
                    originalRequest.url === '/token/refresh/' ||
                    originalRequest.url === '/login/' ||
                    originalRequest.url === '/register/' ||
                    originalRequest.url === '/is_authenticated/' ||
                    originalRequest.url === '/logout/'
                ) {
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(() => {
                        originalRequest.headers['X-CSRFToken'] = getCsrfToken();
                        return axios(originalRequest);
                    }).catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    await axios.post('/token/refresh/', {}, {
                        headers: { 'X-CSRFToken': getCsrfToken() },
                        withCredentials: true,
                    });

                    processQueue(null);
                    originalRequest.headers['X-CSRFToken'] = getCsrfToken();
                    return axios(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('fetchUser'));
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        );
    }, []);

    return null;
}