import { createErrorResponse, CustomError } from '@/lib/error-handler';
import { DiningTablePaymentRequest } from './order.api';

export interface PaymentMethod {
    id: number;
    name: string;
}

export interface PaymentMethodResponse {
    status: number;
    desc: string | null;
    data: PaymentMethod[];
}

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const response = await fetch('/api/payment-method');

    if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
    }

    const data: PaymentMethodResponse = await response.json();
    return data.data;
};


export const findCustomerByPhoneApi = async (phone: string) => {
    const response = await fetch(`/api/customer/find/by-phone?phone=${phone}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        return createErrorResponse(new CustomError('Failed to find customer by phone', response.status));
    }
    return await response.json();
}


export const dinningTablePayment = async (paymentRequest: DiningTablePaymentRequest) => {
    const response = await fetch("/api/orders/dining-table/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Payment request failed", message: "Payment request failed" })) as { message?: string; error?: string };
        const error = new Error(errorData.message || errorData.error || "Payment request failed") as Error & { 
            status?: number; 
            errorData?: { message?: string; error?: string } 
        };
        error.status = response.status;
        error.errorData = errorData;
        throw error;
    }

    return await response.json();
}