import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Order {
    id: string;
    branch: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    time: string;
}

interface RecentOrdersTableProps {
    orders: Order[];
}

const statusConfig = {
    pending: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: Clock,
        label: 'Chờ xử lý'
    },
    processing: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: AlertCircle,
        label: 'Đang xử lý'
    },
    completed: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
        label: 'Hoàn thành'
    },
    cancelled: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
        label: 'Đã hủy'
    },
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng gần đây</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Mã đơn</th>
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Chi nhánh</th>
                            <th className="text-right py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Số tiền</th>
                            <th className="text-center py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="text-right py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const config = statusConfig[order.status];
                            const StatusIcon = config.icon;

                            return (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200 group">
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                                            #{order.id}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-gray-700">{order.branch}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="text-sm font-bold text-gray-900">
                                            {order.amount.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
                                            <StatusIcon size={14} strokeWidth={2.5} />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="text-sm text-gray-600 font-medium">{order.time}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
