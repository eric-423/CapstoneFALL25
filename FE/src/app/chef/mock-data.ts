// Mock data for Chef pages

export interface FoodItem {
    id: number;
    name: string;
    quantity: number;
    orderId: number;
    customerName: string;
    notes?: string;
    orderTime: string;
    estimatedTime: number; // in minutes
    priority: 'high' | 'medium' | 'low';
}

export interface CompletedFoodItem {
    id: number;
    name: string;
    quantity: number;
    orderId: number;
    customerName: string;
    notes?: string;
    orderTime: string;
    completedTime: string;
    priority: 'high' | 'medium' | 'low';
}

// Mock data for pending food items
export const mockFoodItems: FoodItem[] = [
    {
        id: 1,
        name: 'Cơm tấm sườn nướng',
        quantity: 2,
        orderId: 1001,
        customerName: 'Nguyễn Văn A',
        notes: 'Không hành tây',
        orderTime: '14:30',
        estimatedTime: 15,
        priority: 'high'
    },
    {
        id: 2,
        name: 'Cơm tấm bì chả',
        quantity: 1,
        orderId: 1002,
        customerName: 'Trần Thị B',
        orderTime: '14:25',
        estimatedTime: 12,
        priority: 'medium'
    },
    {
        id: 3,
        name: 'Cơm tấm đặc biệt',
        quantity: 3,
        orderId: 1003,
        customerName: 'Lê Văn C',
        notes: 'Thêm rau',
        orderTime: '14:20',
        estimatedTime: 20,
        priority: 'high'
    },
    {
        id: 4,
        name: 'Cơm tấm chả cá',
        quantity: 1,
        orderId: 1004,
        customerName: 'Phạm Thị D',
        orderTime: '14:35',
        estimatedTime: 10,
        priority: 'low'
    },
    {
        id: 5,
        name: 'Cơm tấm thịt nướng',
        quantity: 2,
        orderId: 1005,
        customerName: 'Hoàng Văn E',
        notes: 'Ít cay',
        orderTime: '14:40',
        estimatedTime: 18,
        priority: 'medium'
    },
    {
        id: 6,
        name: 'Cơm tấm tôm rim',
        quantity: 1,
        orderId: 1006,
        customerName: 'Võ Thị F',
        orderTime: '14:45',
        estimatedTime: 14,
        priority: 'high'
    }
];

// Mock data for completed food items
export const mockCompletedItems: CompletedFoodItem[] = [
    {
        id: 101,
        name: 'Cơm tấm sườn nướng',
        quantity: 2,
        orderId: 901,
        customerName: 'Nguyễn Văn A',
        notes: 'Không hành tây',
        orderTime: '14:30',
        completedTime: '14:45',
        priority: 'high'
    },
    {
        id: 102,
        name: 'Cơm tấm bì chả',
        quantity: 1,
        orderId: 902,
        customerName: 'Trần Thị B',
        orderTime: '14:25',
        completedTime: '14:37',
        priority: 'medium'
    },
    {
        id: 103,
        name: 'Cơm tấm đặc biệt',
        quantity: 3,
        orderId: 903,
        customerName: 'Lê Văn C',
        notes: 'Thêm rau',
        orderTime: '14:20',
        completedTime: '14:40',
        priority: 'high'
    },
    {
        id: 104,
        name: 'Cơm tấm chả cá',
        quantity: 1,
        orderId: 904,
        customerName: 'Phạm Thị D',
        orderTime: '14:35',
        completedTime: '14:45',
        priority: 'low'
    },
    {
        id: 105,
        name: 'Cơm tấm thịt nướng',
        quantity: 2,
        orderId: 905,
        customerName: 'Hoàng Văn E',
        notes: 'Ít cay',
        orderTime: '14:15',
        completedTime: '14:33',
        priority: 'medium'
    }
];

// Priority configuration
export const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
};

export const priorityLabels = {
    high: 'Ưu tiên cao',
    medium: 'Ưu tiên trung bình',
    low: 'Ưu tiên thấp'
};
