import { useEffect } from "react";

/**
 * Khóa scroll body khi dialog/màn hình overlay mở để tránh bị trượt nền.
 * Tái sử dụng đúng logic như bản trong admin.
 */
export function useBodyScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);
}


