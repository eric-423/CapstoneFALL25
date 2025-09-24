'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavigationItem {
    href: string;
    label: string;
    external?: boolean;
}

export interface NavigationProps {
    items?: NavigationItem[];
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'mobile';
}

const defaultNavigationItems: NavigationItem[] = [
    { href: '/about', label: 'Về Tâm Tắc' },
    { href: '/partners', label: 'Đối Tác' },
    { href: '/menu', label: 'Thực đơn hôm nay' },
    { href: '/franchise', label: 'Chuyển Cơm Tâm' },
    { href: '/promotions', label: 'Nhượng Quyền' },
    { href: '/stores', label: 'Cửa Hàng' },
];

const Navigation: React.FC<NavigationProps> = ({
    items = defaultNavigationItems,
    className,
    orientation = 'horizontal',
    variant = 'default'
}) => {
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className={cn(
            // Base styles
            "flex",

            // Orientation
            orientation === 'horizontal' ? "items-center space-x-8" : "flex-col space-y-4",

            // Variant styles
            variant === 'mobile' && "w-full",

            className
        )}>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                        // Base link styles
                        "transition-colors hover:opacity-80",

                        // Default variant styles
                        variant === 'default' && [
                            "flex items-center text-center",
                            isActiveLink(item.href) ? "" : ""
                        ],

                        // Mobile variant styles
                        variant === 'mobile' && [
                            "py-2",
                            isActiveLink(item.href) ? "font-bold" : ""
                        ]
                    )}
                    style={{
                        color: '#DA7339',
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        lineHeight: '27px'
                    }}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;