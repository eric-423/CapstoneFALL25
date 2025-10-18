'use client';

import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
    Search,
    User,
    ShoppingCart,
    ChefHat,
    Package,
    GraduationCap,
    Tag,
    MapPin,
    FileText,
    Settings,
    TrendingUp,
    MessageSquare,
} from 'lucide-react';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { cn } from '@/utils/lib/utils';

interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    category: 'users' | 'orders' | 'recipes' | 'ingredients' | 'training' | 'promotions' | 'branches' | 'feedback' | 'navigation';
    url: string;
    icon?: React.ReactNode;
}

const navigationItems: SearchResult[] = [
    { id: 'nav-dashboard', title: 'Bảng điều khiển', category: 'navigation', url: '/admin/dashboard', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'nav-users', title: 'Quản lý người dùng', category: 'navigation', url: '/admin/users', icon: <User className="h-4 w-4" /> },
    { id: 'nav-orders', title: 'Đơn hàng', category: 'navigation', url: '/admin/orders', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'nav-recipes', title: 'Công thức', category: 'navigation', url: '/admin/recipes', icon: <ChefHat className="h-4 w-4" /> },
    { id: 'nav-ingredients', title: 'Nguyên liệu', category: 'navigation', url: '/admin/ingredients', icon: <Package className="h-4 w-4" /> },
    { id: 'nav-training', title: 'Đào tạo', category: 'navigation', url: '/admin/training', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'nav-promotions', title: 'Khuyến mãi', category: 'navigation', url: '/admin/promotions', icon: <Tag className="h-4 w-4" /> },
    { id: 'nav-branches', title: 'Chi nhánh', category: 'navigation', url: '/admin/branches', icon: <MapPin className="h-4 w-4" /> },
    { id: 'nav-feedback', title: 'Phản hồi', category: 'navigation', url: '/admin/feedback', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'nav-finance', title: 'Tài chính', category: 'navigation', url: '/admin/finance', icon: <FileText className="h-4 w-4" /> },
    { id: 'nav-settings', title: 'Cài đặt', category: 'navigation', url: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
];

const categoryIcons = {
    users: <User className="h-4 w-4" />,
    orders: <ShoppingCart className="h-4 w-4" />,
    recipes: <ChefHat className="h-4 w-4" />,
    ingredients: <Package className="h-4 w-4" />,
    training: <GraduationCap className="h-4 w-4" />,
    promotions: <Tag className="h-4 w-4" />,
    branches: <MapPin className="h-4 w-4" />,
    feedback: <MessageSquare className="h-4 w-4" />,
    navigation: <Search className="h-4 w-4" />,
};

const categoryLabels = {
    users: 'Người dùng',
    orders: 'Đơn hàng',
    recipes: 'Công thức',
    ingredients: 'Nguyên liệu',
    training: 'Đào tạo',
    promotions: 'Khuyến mãi',
    branches: 'Chi nhánh',
    feedback: 'Phản hồi',
    navigation: 'Điều hướng',
};

export function GlobalSearchCommand() {
    const router = useRouter();
    const { isSearchOpen, closeSearch } = useAdminContext();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<SearchResult[]>(navigationItems);

    // Handle keyboard shortcuts and focus
    useEffect(() => {
        if (!isSearchOpen) {
            setSearch('');
            return;
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Handle Escape key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchOpen, closeSearch]);

    // Mock search - in real app, this would call APIs
    useEffect(() => {
        if (!search) {
            setResults(navigationItems);
            return;
        }

        const filtered = navigationItems.filter(
            (item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.subtitle?.toLowerCase().includes(search.toLowerCase())
        );

        // TODO: Add real API calls for other categories
        // const [users, orders, recipes, ingredients, training, promotions, branches] = await Promise.all([...])

        setResults(filtered);
    }, [search]);

    const handleSelect = (result: SearchResult) => {
        router.push(result.url);
        closeSearch();
    };

    if (!isSearchOpen) return null;

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = [];
        }
        acc[result.category].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    closeSearch();
                }
            }}
        >
            <div className="fixed left-1/2 top-20 w-full max-w-2xl -translate-x-1/2" onClick={(e) => e.stopPropagation()}>
                <Command
                    className="rounded-lg border border-gray-700/50 bg-slate-900 shadow-2xl"
                    shouldFilter={false}
                >
                    <div className="flex items-center border-b border-gray-700/50 px-4">
                        <Search className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
                        <Command.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Tìm người dùng, đơn hàng, công thức, đào tạo..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-base text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                            autoFocus
                        />
                        <kbd className="pointer-events-none ml-auto hidden h-6 select-none items-center gap-1 rounded border border-gray-700 bg-slate-800 px-1.5 font-mono text-xs font-medium text-gray-400 opacity-100 sm:flex">
                            ESC
                        </kbd>
                    </div>

                    <Command.List className="max-h-[400px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-gray-400">
                            Không tìm thấy kết quả.
                        </Command.Empty>

                        {Object.entries(groupedResults).map(([category, items]) => (
                            <Command.Group
                                key={category}
                                heading={
                                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-400">
                                        {categoryIcons[category as keyof typeof categoryIcons]}
                                        <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                                    </div>
                                }
                            >
                                {items.map((result) => (
                                    <Command.Item
                                        key={result.id}
                                        value={result.title}
                                        onSelect={() => handleSelect(result)}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300',
                                            'hover:bg-slate-800 hover:text-white',
                                            'data-[selected=true]:bg-slate-800 data-[selected=true]:text-white'
                                        )}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-gray-400">
                                            {result.icon || categoryIcons[result.category]}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-medium truncate">{result.title}</span>
                                            {result.subtitle && (
                                                <span className="text-xs text-gray-500 truncate">{result.subtitle}</span>
                                            )}
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ))}
                    </Command.List>

                    <div className="border-t border-gray-700/50 px-4 py-3 text-xs text-gray-400">
                        <div className="flex items-center justify-between">
                            <span>Nhấn <kbd className="rounded bg-slate-800 border border-gray-700 px-1.5 py-0.5 text-gray-300">↑↓</kbd> để điều hướng</span>
                            <span>Nhấn <kbd className="rounded bg-slate-800 border border-gray-700 px-1.5 py-0.5 text-gray-300">↵</kbd> để chọn</span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}
