'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MapPin, Phone, Clock, Mail, User, MessageSquare, Search } from 'lucide-react';

const locations = [
    {
        id: 1,
        name: 'Tầm Tắc Lăng Đại học',
        address: 'Nhà máy bánh mì xích, khu đô thị Đại học Quốc gia TP HCM Tô Hiểu',
        phone: '0909-123-456',
        status: 'Đang bán',
        image: '/images/story.svg'
    },
    {
        id: 2,
        name: 'Tầm Tắc Lăng Đại học',
        address: 'Nhà máy bánh mì xích, khu đô thị Đại học Quốc gia TP HCM Tô Hiểu',
        phone: '0909-123-456',
        status: 'Đang bán',
        image: '/images/story.svg'
    },
    {
        id: 3,
        name: 'Tầm Tắc Lăng Đại học',
        address: 'Nhà máy bánh mì xích, khu đô thị Đại học Quốc gia TP HCM Tô Hiểu',
        phone: '0909-123-456',
        status: 'Đang bán',
        image: '/images/story.svg'
    }
];

export const LocationNewsletterSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Newsletter signup:', formData);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-yellow-200 to-orange-300">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        HỆ THỐNG NHƯỢNG QUYỀN
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side - Locations */}
                    <div>
                        {/* Location Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                <option value="">Tỉnh thành phố</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="hanoi">Hà Nội</option>
                                <option value="danang">Đà Nẵng</option>
                            </select>

                            <select className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                                <option value="">Quận Huyện</option>
                                <option value="q1">Quận 1</option>
                                <option value="q3">Quận 3</option>
                                <option value="q7">Quận 7</option>
                                <option value="thu-duc">Thủ Đức</option>
                            </select>

                            <div className="relative flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Tìm theo địa chỉ..."
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1 rounded">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Location List */}
                        <div className="space-y-4">
                            {locations.map((location) => (
                                <div key={location.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex gap-4">
                                        {/* Location Image */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={location.image}
                                                alt={location.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/placeholder-location.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Location Info */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-1 text-sm">{location.name}</h3>
                                            <div className="flex items-start gap-2 mb-1">
                                                <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-600">{location.address}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Phone className="h-3 w-3 text-gray-500" />
                                                <p className="text-xs text-gray-600">{location.phone}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-green-500" />
                                                    <span className="text-xs text-green-600 font-medium">{location.status}</span>
                                                </div>
                                                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs">
                                                    Chi tiết
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Newsletter Signup */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-orange-500 font-bold text-lg">TẤM</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                ĐĂNG KÝ NHƯỢNG QUYỀN
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Nhận thông tin mới nhất về cơ hội nhượng quyền và ưu đãi đặc biệt từ TẤM TẮC
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Họ và tên"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            {/* Phone and City */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Số điện thoại"
                                />
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="">Thành phố</option>
                                    <option value="hcm">TP. Hồ Chí Minh</option>
                                    <option value="hanoi">Hà Nội</option>
                                    <option value="danang">Đà Nẵng</option>
                                </select>
                            </div>

                            {/* Message Input */}
                            <div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                    placeholder="Ghi chú"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-md font-medium transition-all duration-300"
                            >
                                Gửi thông tin
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};