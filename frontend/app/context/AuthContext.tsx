"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { checkAuthStatus, logout as logoutUser, notificationsCount } from '../lib/api';
import { usePathname, useRouter } from 'next/navigation';
import { IUser } from '../types/user.interface';

interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    isAdmin: boolean;
    isTeacher: boolean;
    countNotifications: number;
    setCountNotifications: React.Dispatch<React.SetStateAction<number>>;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
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
        const isProtected = PROTECTED_PATHS.some(path => pathname?.startsWith(path));
        
        if (!currentUser && isProtected) {
            router.replace('/');
        }
    }, [pathname, router]);

    const refreshAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await checkAuthStatus();

            if (userData && userData.is_authenticated) {
                setUser(userData);
                checkAndRedirect(userData);

                try {
                    const notifCount = await notificationsCount();

                    setCountNotifications(notifCount?.count ?? 0);
                } catch {
                    setCountNotifications(0); 
                }
            } else {
                handleLogout();
            }
        } catch (error) {
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, [checkAndRedirect]);

    function handleLogout() {
        setUser(null);
        setCountNotifications(0);
        checkAndRedirect(null);
    }

    const updateUser = useCallback((data: Partial<IUser>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);

    const isAdmin = useMemo(() => user?.is_admin === true, [user]);
    const isTeacher = useMemo(() => user?.is_teacher === true, [user]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await logoutUser();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            setUser(null);
            router.replace('/');
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
        updateUser
    }), [
        user, 
        isLoading, 
        isAdmin, 
        isTeacher,
        countNotifications,
        refreshAuth, 
        logout, 
        updateUser
    ]);

    useEffect(() => {
        refreshAuth();
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