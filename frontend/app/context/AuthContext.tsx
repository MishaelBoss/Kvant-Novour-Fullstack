"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { checkAuthStatus, logout as logoutUser, notificationsCount, login as apiLogin, register as apiRegister } from '../lib/api';
import { usePathname, useRouter } from 'next/navigation';
import { IUser, IUserLogin, IUserRegister } from '../types/user.interface';
import { PAGES } from '../config/pages.config';
import { ApiError } from 'next/dist/server/api-utils';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    isAdmin: boolean;
    isTeacher: boolean;
    countNotifications: number;
    setCountNotifications: React.Dispatch<React.SetStateAction<number>>;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
    login: (data: IUserLogin) => Promise<void>;
    register: (data: IUserRegister) => Promise<void>;
    updateUser: (data: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PROTECTED_PATHS = ['/profile', '/admin', '/kvantumid'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [countNotifications, setCountNotifications] = useState(0);
    const router = useRouter();
    const pathname = usePathname();

    const checkAndRedirect = useCallback((currentUser: IUser | null) => {
        if (!pathname) return;

        const isPublicProfile = /^\/profile\/[^\/]+/.test(pathname);
        const isProtected = PROTECTED_PATHS.some(path => pathname?.startsWith(path) && !isPublicProfile);

        if (!currentUser && isProtected) {
            router.replace('/');
        }
    }, [pathname, router]);

    const handleLogout = useCallback(async () => {
        setUser(null);
        setCountNotifications(0);
        checkAndRedirect(null);
    }, [checkAndRedirect]);

    const refreshAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await checkAuthStatus();

            if (userData && userData.is_authenticated) {
                setUser(userData);
                checkAndRedirect(userData);

                try {
                    const count = await notificationsCount();

                    setCountNotifications(count);
                } catch (error) {
                    console.error("Ошибка при получении счетчика уведомлений:", error);
                    setCountNotifications(0); 
                }
            } else {
                handleLogout();
            }
        } catch {
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, [handleLogout, checkAndRedirect]);

    const updateUser = useCallback((data: Partial<IUser>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);

    const isAdmin = useMemo(() => user?.is_admin === true, [user]);
    const isTeacher = useMemo(() => user?.is_teacher === true, [user]);

    const login = useCallback(async (data: IUserLogin) => {
        try {
            await apiLogin(data);
            await refreshAuth();
            router.replace(PAGES.MY_PROFILE()); 
        } catch(error) {
            if (error instanceof ApiError) toast.error(error.message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка при загрузке:", error);
        } 
    }, [refreshAuth, router]);

    const register = useCallback(async (data: IUserRegister) => {
        try {
            await apiRegister(data);
            await refreshAuth();
            router.replace(PAGES.MY_PROFILE()); 
        } catch(error) {
            if (error instanceof ApiError) toast.error(error.message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка при загрузке:", error);
        }
    }, [refreshAuth, router]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await logoutUser();

            setUser(null);
            setCountNotifications(0); 

            router.replace(PAGES.HOME()); 
        } catch (error) {
            if (error instanceof ApiError) toast.error(error.message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка при выходе:", error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const contextValue = useMemo(() => ({
        user,
        isLoading,
        isAdmin,
        isTeacher,
        countNotifications,
        setCountNotifications,
        refreshAuth,
        logout,
        login,
        register,
        updateUser
    }), [
        user, 
        isLoading, 
        isAdmin, 
        isTeacher,
        countNotifications,
        refreshAuth, 
        logout, 
        login,
        register,
        updateUser
    ]);

    useEffect(() => {
        const init = async() => refreshAuth();
        init();
    }, [refreshAuth]);

    useEffect(() => {
        const handleFocus = () => {
            if (document.visibilityState === 'visible') {
                refreshAuth();
            }
        };

        window.addEventListener("visibilitychange", handleFocus);
        window.addEventListener("fetchUser", refreshAuth);
        return () => {
            window.removeEventListener("visibilitychange", handleFocus);
            window.removeEventListener("fetchUser", refreshAuth);
        };
    }, [refreshAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);