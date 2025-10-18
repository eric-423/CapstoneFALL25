'use client';

import { useEffect } from 'react';
import { useAdminContext } from '@/utils/contexts/AdminContext';

export function GlobalSearchKeyboardHandler() {
    const { toggleSearch } = useAdminContext();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleSearch();
            }

            // ESC to close
            if (e.key === 'Escape') {
                // Let the component handle this
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [toggleSearch]);

    return null;
}
