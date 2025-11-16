'use client';

import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from '@/utils/contexts/cart/CartContext';
import { ThemeProvider } from '@/utils/contexts/ThemeContext';
import { AuthProvider } from '@/utils/contexts/AuthContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2, // Reduced from 3 to 2 for faster failure handling
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
                refetchOnWindowFocus: false,
                refetchOnMount: false, // Prevent refetch on mount if data is fresh
                refetchOnReconnect: true, // Only refetch on reconnect
            },
        },
    }));

    return (
        <ThemeProvider defaultTheme='light' storageKey='theme'>
            <QueryClientProvider client={queryClient}>
                <CookiesProvider defaultSetOptions={{ path: '/' }}>
                    <AuthProvider>
                        <CartProvider>
                            {children}
                            <ToastContainer
                                position='top-right'
                                className={'mt-15'}
                                autoClose={3000}
                                hideProgressBar={true}
                                newestOnTop={false}
                                pauseOnHover={false}
                                closeOnClick
                                theme='light'
                            />
                        </CartProvider>
                    </AuthProvider>
                </CookiesProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}