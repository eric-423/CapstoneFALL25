'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Hook thay thế cho useNavigate của React Router
 * Cung cấp navigation utilities cho Next.js App Router
 */
export function useNavigation() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const navigate = useCallback((
        path: string,
        options?: {
            replace?: boolean;
            scroll?: boolean;
        }
    ) => {
        if (options?.replace) {
            router.replace(path);
        } else {
            router.push(path);
        }
    }, [router]);

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const goForward = useCallback(() => {
        router.forward();
    }, [router]);

    const refresh = useCallback(() => {
        router.refresh();
    }, [router]);

    // Get current search params
    const getSearchParam = useCallback((key: string) => {
        return searchParams?.get(key) || null;
    }, [searchParams]);

    // Create URL with search params
    const createUrl = useCallback((
        path: string,
        params?: Record<string, string>
    ) => {
        if (!params) return path;

        const url = new URL(path, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        return url.pathname + url.search;
    }, []);

    // Navigate with search params
    const navigateWithParams = useCallback((
        path: string,
        params?: Record<string, string>,
        options?: {
            replace?: boolean;
            scroll?: boolean;
        }
    ) => {
        const url = createUrl(path, params);
        navigate(url, options);
    }, [navigate, createUrl]);

    return {
        navigate,
        goBack,
        goForward,
        refresh,
        getSearchParam,
        createUrl,
        navigateWithParams,
        // Legacy compatibility
        push: navigate,
        replace: (path: string) => navigate(path, { replace: true }),
    };
}

export default useNavigation;
