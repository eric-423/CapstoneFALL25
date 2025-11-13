import { useEffect, useRef } from 'react';
import { assignChefToOrder } from '@/apis/order.api';

interface UseBarcodeScannerOptions {
    enabled?: boolean;
    onSuccess?: (orderId: number) => void;
    onError?: (error: Error) => void;
    onChefBusy?: (orderId: number) => void;
}

export const useBarcodeScanner = (options: UseBarcodeScannerOptions = {}) => {
    const { enabled = true, onSuccess, onError, onChefBusy } = options;
    const barcodeInputRef = useRef('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleKeyDown = async (e: KeyboardEvent) => {
            if (isProcessingRef.current) {
                return;
            }

            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'Enter' && barcodeInputRef.current.trim() !== '') {
                e.preventDefault();
                e.stopPropagation();

                const barcode = barcodeInputRef.current.trim();

                let orderId: number;

                if (barcode.toUpperCase().startsWith('ORDER')) {
                    const numberPart = barcode
                        .replace(/^ORDER[-_\s]*/i, '')
                        .trim();
                    orderId = parseInt(numberPart);
                } else {
                    orderId = parseInt(barcode);
                }

                if (isNaN(orderId) || orderId <= 0) {
                    barcodeInputRef.current = '';
                    return;
                }

                isProcessingRef.current = true;
                try {
                    const result = await assignChefToOrder(orderId);

                    if (result.success) {
                        onSuccess?.(orderId);
                    } else {
                        onChefBusy?.(orderId);
                    }
                } catch (error) {
                    onError?.(error as Error);
                } finally {
                    isProcessingRef.current = false;
                    barcodeInputRef.current = '';
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                }
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const char = e.key;

                const allowedChars = /^[a-zA-Z0-9\-_\s]$/;

                if (!allowedChars.test(char)) {
                    return;
                }

                barcodeInputRef.current += char;

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    barcodeInputRef.current = '';
                }, 500);
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, onSuccess, onError, onChefBusy]);
};

