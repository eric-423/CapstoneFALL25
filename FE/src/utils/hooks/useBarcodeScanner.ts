import { useEffect, useRef } from 'react';
import { assignChefToOrder } from '@/apis/order.api';

type ProcessOrderFn = (orderId: number) => Promise<{ success: boolean }>;

interface UseBarcodeScannerOptions {
    enabled?: boolean;
    processOrder?: ProcessOrderFn;
    onSuccess?: (orderId: number) => void;
    onError?: (error: Error) => void;
    onAlreadyHandled?: (orderId: number) => void;
}

export const useBarcodeScanner = (options: UseBarcodeScannerOptions = {}) => {
    const {
        enabled = true,
        processOrder = assignChefToOrder,
        onSuccess,
        onError,
        onAlreadyHandled,
    } = options;

    // Use refs to store callbacks and function to avoid re-renders
    const processOrderRef = useRef<ProcessOrderFn>(processOrder);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const onAlreadyHandledRef = useRef(onAlreadyHandled);
    const enabledRef = useRef(enabled);

    // Update refs when values change
    useEffect(() => {
        processOrderRef.current = processOrder;
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
        onAlreadyHandledRef.current = onAlreadyHandled;
        enabledRef.current = enabled;
    }, [processOrder, onSuccess, onError, onAlreadyHandled, enabled]);

    const barcodeInputRef = useRef('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef(false);
    const lastKeyTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!enabled) {
            // Reset state when disabled
            isProcessingRef.current = false;
            barcodeInputRef.current = '';
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }

        const handleKeyDown = async (e: KeyboardEvent) => {
            // Check if scanner is still enabled
            if (!enabledRef.current) {
                return;
            }

            // Skip if currently processing
            if (isProcessingRef.current) {
                return;
            }

            // Skip if focus is on input/textarea (user is typing)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Handle Enter key - process barcode
            if (e.key === 'Enter' && barcodeInputRef.current.trim() !== '') {
                // Prevent all default behaviors and stop propagation immediately
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const barcode = barcodeInputRef.current.trim();
                console.log('[Barcode Scanner] Nhận được barcode:', barcode);

                let orderId: number | undefined;
                try {
                    // Parse orderId from barcode
                    const barcodeUpper = String(barcode).toUpperCase();
                    if (barcodeUpper.startsWith('ORDER')) {
                        const numberPart = String(barcode)
                            .replace(/^ORDER[-_\s]*/i, '')
                            .trim();
                        orderId = parseInt(numberPart, 10);
                    } else {
                        // Extract only digits from barcode
                        const digitsOnly = String(barcode).replace(/\D/g, '');
                        orderId = parseInt(digitsOnly, 10);
                    }

                    if (isNaN(orderId) || orderId <= 0) {
                        console.warn('[Barcode Scanner] Không thể parse orderId từ barcode:', barcode);
                        barcodeInputRef.current = '';
                        return;
                    }

                    isProcessingRef.current = true;
                    console.log('[Barcode Scanner] Đang xử lý orderId:', orderId);

                    if (!processOrderRef.current || typeof processOrderRef.current !== 'function') {
                        const errorMsg = `processOrder is not a function. Type: ${typeof processOrderRef.current}, Value: ${processOrderRef.current}`;
                        console.error('[Barcode Scanner]', errorMsg);
                        isProcessingRef.current = false;
                        barcodeInputRef.current = '';
                        throw new Error(errorMsg);
                    }

                    const result = await processOrderRef.current(orderId);
                    console.log('[Barcode Scanner] Kết quả xử lý:', result);

                    if (result?.success === true) {
                        onSuccessRef.current?.(orderId);
                    } else {
                        onAlreadyHandledRef.current?.(orderId);
                    }
                } catch (error) {
                    console.error('[Barcode Scanner] Lỗi khi xử lý:', error);
                    onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
                } finally {
                    isProcessingRef.current = false;
                    barcodeInputRef.current = '';
                    lastKeyTimeRef.current = 0;
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                }
            } 
            // Handle character input - build barcode string
            else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                // Prevent default for single character keys when not in input/textarea
                // This prevents browser from trying to execute the text as code
                e.preventDefault();
                e.stopPropagation();

                const char = e.key;
                const allowedChars = /^[a-zA-Z0-9\-_\s]$/;

                if (!allowedChars.test(char)) {
                    return;
                }

                const now = Date.now();
                // Reset barcode input if too much time has passed since last key (likely new scan)
                if (lastKeyTimeRef.current > 0 && now - lastKeyTimeRef.current > 1000) {
                    barcodeInputRef.current = '';
                }
                lastKeyTimeRef.current = now;

                barcodeInputRef.current += char;

                // Clear existing timeout
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                // Increase timeout to 1000ms to handle slower scanners
                timeoutRef.current = setTimeout(() => {
                    barcodeInputRef.current = '';
                    lastKeyTimeRef.current = 0;
                }, 1000);
            }
        };

        // Use capture phase to catch events early, before other handlers
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            // Reset state on cleanup
            isProcessingRef.current = false;
            barcodeInputRef.current = '';
            lastKeyTimeRef.current = 0;
        };
    }, [enabled]); // Only depend on enabled to avoid re-renders
};

