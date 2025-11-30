// Promotions API functions

export interface Promotion {
    id: string;
    name: string;
    description: string;
    value: number;
    minimumOrderValue: number;
    startDate: string;
    endDate: string;
    status: boolean;
    createdAt: string;
    promotionTypeName: string;
    createdByName: string;
    receivedDate: string | null;
    usedDate: string | null;
    userPromotionStatus: string | null;
    usageCount: number;
    code?: string;
}

export interface CreatePromotionData {
    name: string;
    description: string;
    value: number;
    minimumOrderValue: number;
    startDate: string;
    endDate: string;
    status: boolean;
    promotionTypeId: number;
}

export interface UpdatePromotionData {
    name: string;
    description: string;
    value: number;
    minimumOrderValue: number;
    startDate: string;
    endDate: string;
    status: boolean;
    promotionTypeId: number;
}

export interface UserAssignment {
    userId: number;
    usageCount: number;
}

export interface AssignPromotionData {
    promotionCode: string;
    userAssignments: UserAssignment[];
}

export interface PromotionsResponse {
    status: number;
    desc: string;
    data: Promotion[];
}


export async function getAllPromotions() {
    const response = await fetch('/api/promotions/all', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
            response: {
                data: errorBody,
                status: response.status,
            },
        };
    }

    const result = await response.json();
    return result.data as Promotion[];
}

/**
 * Tạo promotion mới
 */
export async function createPromotion(data: CreatePromotionData) {
    const response = await fetch('/api/promotions/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
            response: {
                data: errorBody,
                status: response.status,
            },
        };
    }

    const result = await response.json();
    return result;
}

/**
 * Assign promotion cho users
 */
export async function assignPromotion(data: AssignPromotionData) {
    const response = await fetch('/api/promotions/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
            response: {
                data: errorBody,
                status: response.status,
            },
        };
    }

    const result = await response.json();
    return result;
}

/**
 * Cập nhật promotion
 */
export async function updatePromotion(promotionCode: string, data: UpdatePromotionData) {
    const response = await fetch(`/api/promotions/${promotionCode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
            response: {
                data: errorBody,
                status: response.status,
            },
        };
    }

    const result = await response.json();
    return result;
}

/**
 * Thay đổi trạng thái promotion
 */
export async function togglePromotionStatus(promotionCode: string, status: boolean) {
    const response = await fetch(`/api/promotions/${promotionCode}/status?status=${status}`, {
        method: 'PUT',
        credentials: 'include',
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw {
            response: {
                data: errorBody,
                status: response.status,
            },
        };
    }

    const result = await response.json();
    return result;
}
