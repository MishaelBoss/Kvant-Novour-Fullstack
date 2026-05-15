"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '@/app/types/user.interface';
import { checkAuthStatus, logout as logoutUser } from '../lib/api';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    isTeacher: boolean;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const PROTECTED_PATHS = ['/profile', '/admin', '/kvantumid'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkAndRedirect = useCallback((currentUser: User | null) => {
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
            } else {
                setUser(null);
                checkAndRedirect(null);
            }
        } catch (error) {
            setUser(null);
            checkAndRedirect(null);
        } finally {
            setIsLoading(false);
        }
    }, [checkAndRedirect]);

    const updateUser = useCallback((data: Partial<User>) => {
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
        refreshAuth,
        logout,
        updateUser
    }), [
        user, 
        isLoading, 
        isAdmin, 
        isTeacher,
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