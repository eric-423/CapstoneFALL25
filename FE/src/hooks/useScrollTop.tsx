'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const useScrollTop = () => {
  // Extracts pathname property(key) from Next.js router
  const pathname = usePathname();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
};

export default useScrollTop;
