'use client';

import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from '@/contexts/cart/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 3,
                staleTime: 5 * 60 * 1000, // 5 minutes
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <ThemeProvider defaultTheme='system' storageKey='theme'>
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