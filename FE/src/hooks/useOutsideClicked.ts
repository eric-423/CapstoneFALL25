import { useEffect } from 'react';

export function useOutsideClicked(ref: HTMLDivElement | null, callback: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!ref?.contains(event.target as Node)) {
        callback?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, enabled, callback]);
}
