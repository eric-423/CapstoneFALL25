import { useEffect, useRef } from 'react';
import { assignChefToOrder } from '@/apis/order.api';

export type BarcodeProcessAction =
    | 'assign-chef'
    | 'assign-shipper'
    | 'complete'
    | 'no-action'
    | 'unknown';

export interface BarcodeProcessContext {
    action?: BarcodeProcessAction;
    status?: string;
    message?: string;
}

export interface ProcessOrderResult {
    success: boolean;
    context?: BarcodeProcessContext;
}

export type ProcessOrderFn = (orderId: number) => Promise<ProcessOrderResult>;

const defaultProcessOrder: ProcessOrderFn = async (orderId: number) => {
    const result = await assignChefToOrder(orderId);
    return {
        success: result.success,
        context: {
            action: 'assign-chef',
        },
    };
};

interface UseBarcodeScannerOptions {
    enabled?: boolean;
    processOrder?: ProcessOrderFn;
    onSuccess?: (orderId: number, context?: BarcodeProcessContext) => void;
    onError?: (error: Error) => void;
    onAlreadyHandled?: (orderId: number, context?: BarcodeProcessContext) => void;
}

export const useBarcodeScanner = (options: UseBarcodeScannerOptions = {}) => {
    const {
        enabled = true,
        processOrder = defaultProcessOrder,
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
            if (!enabledRef.current) {
                return;
            }

            if (isProcessingRef.current) {
                return;
            }

            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'Enter' && barcodeInputRef.current.trim() !== '') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const barcode = barcodeInputRef.current.trim();

                let orderId: number | undefined;
                try {
                    const barcodeUpper = String(barcode).toUpperCase();
                    if (barcodeUpper.startsWith('ORDER')) {
                        const numberPart = String(barcode)
                            .replace(/^ORDER[-_\s]*/i, '')
                            .trim();
                        orderId = parseInt(numberPart, 10);
                    } else {
                        const digitsOnly = String(barcode).replace(/\D/g, '');
                        orderId = parseInt(digitsOnly, 10);
                    }

                    if (isNaN(orderId) || orderId <= 0) {
                        console.warn('[Barcode Scanner] Không thể parse orderId từ barcode:', barcode);
                        barcodeInputRef.current = '';
                        return;
                    }

                    isProcessingRef.current = true;

                    if (!processOrderRef.current || typeof processOrderRef.current !== 'function') {
                        const errorMsg = `processOrder is not a function. Type: ${typeof processOrderRef.current}, Value: ${processOrderRef.current}`;
                        console.error('[Barcode Scanner]', errorMsg);
                        isProcessingRef.current = false;
                        barcodeInputRef.current = '';
                        throw new Error(errorMsg);
                    }

                    const result = await processOrderRef.current(orderId);

                    if (result?.success === true) {
                        onSuccessRef.current?.(orderId, result.context);
                    } else {
                        onAlreadyHandledRef.current?.(orderId, result?.context);
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
            else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                e.stopPropagation();

                const char = e.key;
                const allowedChars = /^[a-zA-Z0-9\-_\s]$/;

                if (!allowedChars.test(char)) {
                    return;
                }

                const now = Date.now();
                if (lastKeyTimeRef.current > 0 && now - lastKeyTimeRef.current > 1000) {
                    barcodeInputRef.current = '';
                }
                lastKeyTimeRef.current = now;

                barcodeInputRef.current += char;

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    barcodeInputRef.current = '';
                    lastKeyTimeRef.current = 0;
                }, 1000);
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            isProcessingRef.current = false;
            barcodeInputRef.current = '';
            lastKeyTimeRef.current = 0;
        };
    }, [enabled]);
};

