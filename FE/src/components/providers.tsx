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
                retry: 2,
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: true,
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
                        </CartProvider>
                        <ToastContainer
                            position='top-center'
                            className={'mt-15'}
                            autoClose={3000}
                            hideProgressBar={true}
                            newestOnTop={false}
                            pauseOnHover={false}
                            closeOnClick
                            closeButton={false}
                            icon={false}
                            theme='light'
                        />
                    </AuthProvider>
                </CookiesProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}