import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
    return (
        <footer className={cn(
            "bg-gray-900 text-white",
            className
        )}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">T</span>
                            </div>
                            <span className="font-bold text-xl">TamTech</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Mang đến những món cơm tấm ngon nhất với công nghệ hiện đại
                            và dịch vụ tận tâm cho khách hàng.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/menu" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Menu cơm tấm
                            </Link>
                            <Link href="/promotions" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Ưu đãi
                            </Link>
                            <Link href="/blog" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Tin tức
                            </Link>
                            <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Liên hệ
                            </Link>
                            <Link href="/franchise" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Nhượng quyền
                            </Link>
                        </nav>
                    </div>

                    {/* Customer Support */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Hỗ trợ khách hàng</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/help" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Trung tâm hỗ trợ
                            </Link>
                            <Link href="/faq" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Câu hỏi thường gặp
                            </Link>
                            <Link href="/terms" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Điều khoản sử dụng
                            </Link>
                            <Link href="/privacy" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                                Chính sách bảo mật
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Liên hệ</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                    123 Đường ABC, Quận 1, TP.HCM
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                    (028) 1234 5678
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                    hello@tamtech.vn
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © 2025 TamTech. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                                Điều khoản
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                                Bảo mật
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;