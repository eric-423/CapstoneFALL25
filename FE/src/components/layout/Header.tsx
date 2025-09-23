import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import MobileNav from './MobileNav';
import Navigation from './Navigation';

export interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
            className
        )}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">TamTech</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <Navigation className="hidden md:flex" />

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search (hidden on mobile) */}
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="sm" className="relative">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Button>

                        {/* User menu (hidden on mobile) */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <User className="h-4 w-4" />
                            </Button>
                            <Button variant="primary" size="sm">
                                Đăng nhập
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <MobileNav
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
            </div>
        </header>
    );
};

export default Header;