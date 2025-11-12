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
