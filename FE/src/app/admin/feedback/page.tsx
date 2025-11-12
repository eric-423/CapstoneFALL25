'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Star, Reply, CheckCircle, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'ALL' | 'PENDING' | 'RESOLVED';

// Temporary empty array until API is implemented
const MOCK_FEEDBACK: any[] = [];

export default function FeedbackPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
    const [expandedReply, setExpandedReply] = useState<number | null>(null);

    const filteredFeedback = MOCK_FEEDBACK.filter(f => {
        if (activeFilter === 'ALL') return true;
        return f.status === activeFilter;
    });

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                        <MessageSquare className="text-white" size={28} strokeWidth={2.5} />
                                    </div>
                                    Phản Hồi & Hỗ Trợ
                                </h1>
                                <p className="text-gray-600 text-lg">Xem và trả lời phản hồi từ khách hàng</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tổng phản hồi</p>
                                    <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">{MOCK_FEEDBACK.length}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <MessageSquare className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Chờ xử lý</p>
                                    <p className="text-4xl font-bold text-yellow-600 group-hover:scale-105 transition-transform">
                                        {MOCK_FEEDBACK.filter(f => f.status === 'PENDING').length}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <Clock className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đã xử lý</p>
                                    <p className="text-4xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                                        {MOCK_FEEDBACK.filter(f => f.status === 'RESOLVED').length}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                                    <CheckCircle className="text-white" size={26} strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-500" strokeWidth={2.5} />
                            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Lọc:</span>
                        </div>
                        <div className="flex gap-3">
                            {(['ALL', 'PENDING', 'RESOLVED'] as FilterType[]).map((filter) => (
                                <Button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    variant={activeFilter === filter ? 'default' : 'outline'}
                                    className={`rounded-xl font-semibold transition-all duration-300 ${activeFilter === filter
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                                        : 'border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {filter === 'ALL' ? 'Tất cả' : filter === 'PENDING' ? 'Chờ xử lý' : 'Đã xử lý'}
                                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">
                                        {filter === 'ALL'
                                            ? MOCK_FEEDBACK.length
                                            : MOCK_FEEDBACK.filter(f => f.status === filter).length}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-6">
                        {filteredFeedback.map(feedback => (
                            <Card key={feedback.id} className="bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group">
                                {/* Gradient top border */}
                                <div className={`h-1.5 bg-gradient-to-r ${feedback.rating >= 4
                                    ? 'from-green-500 to-emerald-500'
                                    : feedback.rating >= 3
                                        ? 'from-yellow-500 to-orange-500'
                                        : 'from-red-500 to-pink-500'
                                    }`}></div>

                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar with gradient border */}
                                            <div className="relative">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${feedback.rating >= 4
                                                    ? 'from-green-500 to-emerald-500'
                                                    : feedback.rating >= 3
                                                        ? 'from-yellow-500 to-orange-500'
                                                        : 'from-red-500 to-pink-500'
                                                    } rounded-full blur-md opacity-50`}></div>
                                                <div className={`relative w-16 h-16 bg-gradient-to-br ${feedback.rating >= 4
                                                    ? 'from-green-500 to-emerald-500'
                                                    : feedback.rating >= 3
                                                        ? 'from-yellow-500 to-orange-500'
                                                        : 'from-red-500 to-pink-500'
                                                    } rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                                    {feedback.customerName.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">{feedback.customerName}</h3>
                                                <p className="text-sm text-gray-500 font-medium mt-1">
                                                    {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap justify-end">
                                            <span className={`text-xs px-4 py-2 rounded-xl font-bold border-2 ${feedback.type === 'REVIEW'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}>{feedback.type}</span>
                                            <span className={`inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold border-2 ${feedback.status === 'RESOLVED'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {feedback.status === 'RESOLVED' ? <CheckCircle size={14} strokeWidth={2.5} /> : <Clock size={14} strokeWidth={2.5} />}
                                                {feedback.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rating and Comment */}
                                    <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={24}
                                                    strokeWidth={2.5}
                                                    className={`transition-all ${i < feedback.rating
                                                        ? 'fill-yellow-400 text-yellow-400 scale-110'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                                {feedback.rating}/5
                                            </span>
                                        </div>
                                        <p className="text-gray-900 leading-relaxed text-base">{feedback.comment}</p>
                                    </div>

                                    {feedback.orderId && (
                                        <div className="mb-6 flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <span className="text-sm font-semibold text-gray-600">Đơn hàng:</span>
                                            <span className="font-mono font-bold text-primary text-lg">#{feedback.orderId}</span>
                                        </div>
                                    )}

                                    {/* Reply Section */}
                                    <div className="pt-6 border-t-2 border-gray-100">
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setExpandedReply(expandedReply === feedback.id ? null : feedback.id)}
                                                variant="outline"
                                                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 py-6 text-base"
                                            >
                                                <Reply size={18} className="mr-2" strokeWidth={2.5} />
                                                {expandedReply === feedback.id ? 'Đóng' : 'Trả lời'}
                                            </Button>
                                            {feedback.status === 'PENDING' && (
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold rounded-xl transition-all duration-300 py-6 text-base"
                                                >
                                                    <CheckCircle size={18} className="mr-2" strokeWidth={2.5} />
                                                    Đánh dấu đã xử lý
                                                </Button>
                                            )}
                                        </div>

                                        {/* Expandable Reply Form */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedReply === feedback.id ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border-2 border-primary/20">
                                                <textarea
                                                    placeholder="Nhập nội dung trả lời..."
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                                    rows={4}
                                                />
                                                <div className="flex gap-3 mt-4">
                                                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all py-3">
                                                        Gửi trả lời
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setExpandedReply(null)}
                                                        className="px-6 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all"
                                                    >
                                                        Hủy
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
