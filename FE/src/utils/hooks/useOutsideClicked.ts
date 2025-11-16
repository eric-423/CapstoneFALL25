'use client';

import { useEffect, RefObject } from 'react';

type RefType = RefObject<HTMLDivElement | null> | HTMLDivElement | null;

export function useOutsideClicked(ref: RefType, callback: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const element = ref && typeof ref === 'object' && 'current' in ref ? ref.current : ref;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!element?.contains(event.target as Node)) {
        callback?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, enabled, callback]);
}
