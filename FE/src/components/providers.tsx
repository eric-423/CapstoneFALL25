'use client';

import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from '@/contexts/cart/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider defaultTheme='system' storageKey='theme'>
            <QueryClientProvider client={queryClient}>
                <CookiesProvider defaultSetOptions={{ path: '/' }}>
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
                </CookiesProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}