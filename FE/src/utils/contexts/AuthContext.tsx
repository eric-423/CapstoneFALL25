'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useAuth from '@/utils/hooks/useAuth.nextjs';
import type { UserAuthData } from '@/utils/types/user.type';

interface AuthContextType {
    user: UserAuthData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    redirectAfterLogin: (userRole: string) => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}