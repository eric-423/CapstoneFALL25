'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Settings, Building2, CreditCard, Receipt, Database, Save, Moon, Sun, Upload, Eye } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function SettingsPage() {
    const [appName, setAppName] = useState('Tấm Tắc');
    const [primaryColor, setPrimaryColor] = useState('#EC6426');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [vnpayEnabled, setVnpayEnabled] = useState(true);
    const [cashEnabled, setCashEnabled] = useState(true);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                <Settings className="text-white" size={28} strokeWidth={2.5} />
                            </div>
                            Cài Đặt Hệ Thống
                        </h1>
                        <p className="text-gray-600 text-lg">Cấu hình các thông số hệ thống</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Settings */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Brand Information */}
                            <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Building2 className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Thông Tin Thương Hiệu</h2>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wider">Tên ứng dụng</label>
                                        <Input
                                            value={appName}
                                            onChange={(e) => setAppName(e.target.value)}
                                            className="border-2 border-gray-200 focus:border-primary rounded-xl py-6 text-lg font-semibold transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wider">Logo</label>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="outline"
                                                className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all py-6 px-6"
                                            >
                                                <Upload size={18} className="mr-2" strokeWidth={2.5} />
                                                Tải lên logo
                                            </Button>
                                            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border-2 border-gray-200">
                                                <Image src="/full-logo.svg" alt="Logo" width={32} height={32} />
                                                <span className="text-sm font-semibold text-gray-600">Current Logo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wider">Màu chủ đạo</label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-24 h-24 border-4 border-gray-200 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
                                            />
                                            <div className="flex-1 p-6 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border-2 border-gray-200">
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Selected Color</p>
                                                <p className="text-2xl font-bold text-gray-900 font-mono">{primaryColor}</p>
                                                <div className="mt-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Payment Methods */}
                            <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <CreditCard className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Thanh Toán</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${vnpayEnabled
                                            ? 'bg-gradient-to-r from-primary/10 to-transparent border-primary shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`} onClick={() => setVnpayEnabled(!vnpayEnabled)}>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">VNPay</p>
                                            <p className="text-sm text-gray-600 font-medium">Cổng thanh toán VNPay</p>
                                        </div>
                                        <div className={`w-16 h-8 rounded-full transition-all duration-300 ${vnpayEnabled ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-300'
                                            }`}>
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 m-1 ${vnpayEnabled ? 'translate-x-8' : 'translate-x-0'
                                                }`}></div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${cashEnabled
                                            ? 'bg-gradient-to-r from-secondary/10 to-transparent border-secondary shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`} onClick={() => setCashEnabled(!cashEnabled)}>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">Tiền mặt</p>
                                            <p className="text-sm text-gray-600 font-medium">Thanh toán khi nhận hàng</p>
                                        </div>
                                        <div className={`w-16 h-8 rounded-full transition-all duration-300 ${cashEnabled ? 'bg-gradient-to-r from-secondary to-yellow-500' : 'bg-gray-300'
                                            }`}>
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 m-1 ${cashEnabled ? 'translate-x-8' : 'translate-x-0'
                                                }`}></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Taxes & Fees */}
                            <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Receipt className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Thuế & Phí</h2>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wider">Thuế VAT (%)</label>
                                        <Input type="number" defaultValue="10" className="border-2 border-gray-200 focus:border-primary rounded-xl py-6 text-lg font-semibold transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-3 text-gray-700 uppercase tracking-wider">Phí giao hàng (đ)</label>
                                        <Input type="number" defaultValue="20000" className="border-2 border-gray-200 focus:border-primary rounded-xl py-6 text-lg font-semibold transition-all" />
                                    </div>
                                </div>
                            </Card>

                            {/* Backup & Restore */}
                            <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Database className="text-white" size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Sao Lưu & Khôi Phục</h2>
                                </div>
                                <div className="flex gap-4 flex-wrap">
                                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all py-6 text-base">
                                        <Database size={18} className="mr-2" strokeWidth={2.5} />
                                        Sao lưu dữ liệu
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all py-6 text-base">
                                        <Upload size={18} className="mr-2" strokeWidth={2.5} />
                                        Khôi phục dữ liệu
                                    </Button>
                                </div>
                            </Card>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all py-6 px-12 text-lg">
                                    <Save size={22} className="mr-2" strokeWidth={2.5} />
                                    Lưu Cài Đặt
                                </Button>
                            </div>
                        </div>

                        {/* Live Preview Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Live Preview Card */}
                                <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Eye className="text-white" size={24} strokeWidth={2.5} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
                                    </div>

                                    {/* Preview Content */}
                                    <div className="space-y-6">
                                        {/* App Name Preview */}
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border-2 border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">App Name</p>
                                            <p className="text-3xl font-bold text-gray-900">{appName}</p>
                                        </div>

                                        {/* Logo Preview */}
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border-2 border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Logo</p>
                                            <div className="flex items-center justify-center py-8">
                                                <Image src="/full-logo.svg" alt="Logo Preview" width={120} height={120} />
                                            </div>
                                        </div>

                                        {/* Color Preview */}
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border-2 border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Primary Color</p>
                                            <div
                                                className="h-32 rounded-2xl shadow-lg"
                                                style={{ backgroundColor: primaryColor }}
                                            ></div>
                                            <p className="text-center mt-3 font-mono font-bold text-gray-900">{primaryColor}</p>
                                        </div>

                                        {/* Sample Button */}
                                        <div className="p-6 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl border-2 border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Button Preview</p>
                                            <Button
                                                className="w-full py-6 text-base font-bold rounded-xl shadow-lg"
                                                style={{
                                                    background: `linear-gradient(to right, ${primaryColor}, #F8A91F)`
                                                }}
                                            >
                                                Sample Button
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Dark Mode Toggle */}
                                <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Dark Mode</h3>
                                            <p className="text-sm text-gray-600 mt-1">Chế độ tối</p>
                                        </div>
                                        <div
                                            className={`w-16 h-8 rounded-full cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                                }`}
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 m-1 flex items-center justify-center ${isDarkMode ? 'translate-x-8' : 'translate-x-0'
                                                }`}>
                                                {isDarkMode ? <Moon size={14} className="text-gray-900" /> : <Sun size={14} className="text-yellow-500" />}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {isDarkMode ? '🌙 Chế độ tối đang bật' : '☀️ Chế độ sáng đang bật'}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
