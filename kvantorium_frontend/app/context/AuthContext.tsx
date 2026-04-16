"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '@/app/types/user.interface';
import { checkAuthStatus, logout as logoutUser } from '../lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { PAGES } from '../config/page';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await checkAuthStatus();

            if (userData && userData.is_authenticated) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            setUser(null);
            router.push(PAGES.HOME());
        }
    }, [router]);

    useEffect(() => {
        refreshAuth();

        window.addEventListener("fetchUser", refreshAuth);

        return () => {
            window.removeEventListener("fetchUser", refreshAuth);
        };
    }, [refreshAuth]); 

    return (
        <AuthContext.Provider value={{ user, isLoading, refreshAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);