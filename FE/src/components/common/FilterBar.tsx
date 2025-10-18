'use client';

import React, { useState } from 'react';
import { Search, X, Filter, Save, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface FilterChip {
    id: string;
    label: string;
    value: string;
    removable?: boolean;
}

export interface SavedFilter {
    id: string;
    name: string;
    filters: FilterChip[];
}

export interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    filters?: FilterChip[];
    onRemoveFilter?: (filterId: string) => void;
    onClearAll?: () => void;
    savedFilters?: SavedFilter[];
    onApplySavedFilter?: (filter: SavedFilter) => void;
    onSaveCurrentFilter?: (name: string) => void;
    showAdvancedFilters?: boolean;
    onToggleAdvancedFilters?: () => void;
    customActions?: React.ReactNode;
    className?: string;
}

export function FilterBar({
    searchPlaceholder = 'Tìm kiếm...',
    searchValue = '',
    onSearchChange,
    filters = [],
    onRemoveFilter,
    onClearAll,
    savedFilters = [],
    onApplySavedFilter,
    onSaveCurrentFilter,
    showAdvancedFilters = false,
    onToggleAdvancedFilters,
    customActions,
    className = '',
}: FilterBarProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [filterName, setFilterName] = useState('');

    const activeFiltersCount = filters.length;
    const hasActiveFilters = activeFiltersCount > 0 || searchValue.length > 0;

    const handleSaveFilter = () => {
        if (filterName.trim() && onSaveCurrentFilter) {
            onSaveCurrentFilter(filterName.trim());
            setFilterName('');
            setIsSaving(false);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                {/* Search Input */}
                <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-10 pr-10 h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                        {searchValue && (
                            <button
                                onClick={() => onSearchChange?.('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Advanced Filters Toggle */}
                {onToggleAdvancedFilters && (
                    <Button
                        variant={showAdvancedFilters ? 'default' : 'outline'}
                        size="sm"
                        onClick={onToggleAdvancedFilters}
                        className="h-10"
                        style={!showAdvancedFilters ? { color: '#000000', fontWeight: '600' } : undefined}
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Bộ lọc nâng cao
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                )}

                {/* Saved Filters Dropdown */}
                {savedFilters.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 text-gray-900 font-semibold" style={{ color: '#000000' }}>
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc đã lưu
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Bộ lọc đã lưu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {savedFilters.map((filter) => (
                                <DropdownMenuItem
                                    key={filter.id}
                                    onClick={() => onApplySavedFilter?.(filter)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{filter.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {filter.filters.length} điều kiện
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Save Current Filter */}
                {hasActiveFilters && onSaveCurrentFilter && (
                    <>
                        {!isSaving ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSaving(true)}
                                className="h-10 text-gray-900 font-semibold"
                                style={{ color: '#000000' }}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Lưu bộ lọc
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                    placeholder="Tên bộ lọc..."
                                    className="h-10 w-48"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveFilter();
                                        if (e.key === 'Escape') setIsSaving(false);
                                    }}
                                    autoFocus
                                />
                                <Button size="sm" onClick={handleSaveFilter} className="h-10">
                                    Lưu
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsSaving(false)}
                                    className="h-10"
                                >
                                    Hủy
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Clear All */}
                {hasActiveFilters && onClearAll && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Xóa tất cả
                    </Button>
                )}

                {/* Custom Actions */}
                {customActions}
            </div>

            {/* Active Filter Chips */}
            {filters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Đang lọc:</span>
                    {filters.map((filter) => (
                        <Badge
                            key={filter.id}
                            variant="secondary"
                            className="px-3 py-1.5 bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-colors"
                        >
                            <span className="font-medium">{filter.label}:</span>
                            <span className="ml-1">{filter.value}</span>
                            {filter.removable !== false && onRemoveFilter && (
                                <button
                                    onClick={() => onRemoveFilter(filter.id)}
                                    className="ml-2 hover:text-orange-900 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </Badge>
                    ))}
                    {onClearAll && filters.length > 1 && (
                        <button
                            onClick={onClearAll}
                            className="text-sm text-gray-500 hover:text-red-600 transition-colors ml-2"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
