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
    { href: '/', label: 'Trang chủ' },
    { href: '/menu', label: 'Menu' },
    { href: '/blog', label: 'Blog' },
    { href: '/promotions', label: 'Ưu đãi' },
    { href: '/contact', label: 'Liên hệ' },
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
                        "transition-colors font-medium",

                        // Default variant styles
                        variant === 'default' && [
                            "text-gray-600 hover:text-orange-500",
                            isActiveLink(item.href) && "text-orange-500"
                        ],

                        // Mobile variant styles
                        variant === 'mobile' && [
                            "text-gray-700 hover:text-orange-500 py-2",
                            isActiveLink(item.href) && "text-orange-500 font-semibold"
                        ]
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;