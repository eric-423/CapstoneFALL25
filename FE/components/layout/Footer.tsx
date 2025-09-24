import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
    return (
        <footer className={cn(
            "bg-gradient-to-r from-orange-500 to-red-500 text-white",
            className
        )}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/images/full-logo-white.svg"
                                alt="Tâm Tắc Logo"
                                width={10}
                                height={40}
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="text-white text-opacity-90 text-sm leading-relaxed">
                            Thương hiệu cơm tâm hàng đầu dành cho sinh viên -
                            Tâm ngon, Tắc nhỏ!
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white text-opacity-70 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white text-opacity-70 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Thông tin */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Thông tin</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/about" className="text-white text-opacity-90 hover:text-white transition-colors text-sm">
                                Về Tâm Tắc
                            </Link>
                            <Link href="/careers" className="text-white text-opacity-90 hover:text-white transition-colors text-sm">
                                Chuyển Cơm Tâm
                            </Link>
                        </nav>
                    </div>

                    {/* Dịch vụ */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Dịch vụ</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/delivery" className="text-white text-opacity-90 hover:text-white transition-colors text-sm">
                                Đối tác
                            </Link>
                            <Link href="/support" className="text-white text-opacity-90 hover:text-white transition-colors text-sm">
                                Nhượng quyền
                            </Link>
                        </nav>
                    </div>

                    {/* Liên hệ */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-white">Liên hệ</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                                <span className="text-white text-opacity-90 text-sm">
                                    Số 1 Võ Văn Ngân - Thủ Đức, Long Thạnh Mỹ, Thành phố Thủ Đức, TP Hồ Chí Minh
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-white flex-shrink-0" />
                                <span className="text-white text-opacity-90 text-sm">
                                    0909-123-456
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-white flex-shrink-0" />
                                <span className="text-white text-opacity-90 text-sm">
                                    tamtac@tamtac.com
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
