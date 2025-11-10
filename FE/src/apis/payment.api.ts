import http from '@/utils/http';

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
    const { data } = await http.get<PaymentMethodResponse>('/payment-method');
    return data.data;
};
