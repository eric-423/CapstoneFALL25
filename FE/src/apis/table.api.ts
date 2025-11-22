export interface TableData {
    id: number;
    name: string;
    isActive: boolean;
    seat: number;
    note: string;
    branchId: number;
    currentOrder: CurrentOrder | null;
    orders: CurrentOrder[];
}

export interface CurrentOrder {
    id: number;
    subTotal: number;
    promotionCode: string | null;
    discountValue: number | null;
    discountPercent: number | null;
    amount: number;
    shippingFee: number | null;
    isPickUp: boolean;
    isTable: boolean;
    delivery_at: string | null;
    orderStatus: string;
    note: string;
    payment_code: string | null;
    address: string;
    phone: string;
    pointUsed: number;
    pointEarned: number;
    createdAt: string;
    orderItems: OrderItem[];
    customerDTO: {
        id: number;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        isActive: boolean | null;
        dateOfBirth: string | null;
        createdAt: string | null;
        memberPoint: number | null;
        memberRank: string | null;
    };
    pickupTime: string | null;
    customerName: string;
    status: string;
    paymentUrl: string | null;
}

export interface OrderItem {
    productId: number;
    productName: string;
    orderId: number;
    quantity: number;
    price: number;
    note: string | null;
    feedback: string | null;
    feedbackPoint: number;
    expiredFeedbackTime: string | null;
    productImg: string;
    comboDTO: {
        id: number;
        name: string;
        description: string;
        price: number;
        startDate: string;
        endDate: string;
        branchId: number;
        comboItems: Array<{
            productId: number;
            comboId: number;
            quantity: number;
            note: string;
        }>;
        active: boolean;
    } | null;
    isConfirmed: boolean;
    isDelivered: boolean;
    feedBackYet: boolean;
}

export const getTableById = async (tableId: string): Promise<TableData> => {
    const response = await fetch(`/api/table/${tableId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch table data');
    }

    const data = await response.json();
    return data;
};
