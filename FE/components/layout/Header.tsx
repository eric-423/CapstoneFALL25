'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, User, Bell } from 'lucide-react';
import Button from '@/components/ui/Button';
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
            "sticky top-0 z-50 w-full",
            className
        )} style={{
            backgroundColor: '#EFE6DB',
            height: '71px',
            filter: 'drop-shadow(0.5px 0.5px 23.3px rgba(45, 30, 26, 0.2))'
        }}>
            <div className="container mx-auto pl-4 pr-4">
                <div className="flex items-center justify-between" style={{ height: '71px' }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 -ml-8">
                        <Image
                            src="/images/full-logo.svg"
                            alt="Tâm Tắc Logo"
                            width={250}
                            height={103}
                            className="w-[250px] h-[103px]"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <Navigation className="hidden md:flex" />

                    {/* Right side actions */}
                    <div className="flex items-center space-x-2">
                        {/* Notification Bell */}
                        <Button className="relative bg-transparent hover:bg-black/10 p-2" style={{ color: '#DA7339' }}>
                            <Bell className="h-5 w-5" />
                        </Button>

                        {/* User Profile */}
                        <Button className="bg-transparent hover:bg-black/10 p-2" style={{ color: '#DA7339' }}>
                            <User className="h-5 w-5" />
                        </Button>

                        {/* Cart */}
                        <Button className="relative bg-transparent hover:bg-black/10 p-2" style={{ color: '#DA7339' }}>
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            className="md:hidden bg-transparent hover:bg-black/10 p-2"
                            style={{ color: '#DA7339' }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
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