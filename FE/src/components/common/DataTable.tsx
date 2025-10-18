'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Download,
    Trash2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
    id: string;
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    sortable?: boolean;
    resizable?: boolean;
    width?: number;
    minWidth?: number;
    className?: string;
    headerClassName?: string;
    cellClassName?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    getRowId?: (row: T) => string;
    defaultSort?: { columnId: string; direction: SortDirection };
    pagination?: {
        pageSize?: number;
        pageSizeOptions?: number[];
    };
    actions?: {
        onExport?: () => void;
        onDelete?: (ids: string[]) => void;
        customActions?: React.ReactNode;
    };
    emptyState?: {
        title?: string;
        description?: string;
        icon?: React.ReactNode;
        action?: React.ReactNode;
    };
    stickyHeader?: boolean;
    className?: string;
    rowClassName?: string | ((row: T) => string);
}

export function DataTable<T>({
    data,
    columns,
    selectable = false,
    onSelectionChange,
    getRowId = (row) => String((row as Record<string, unknown>).id || Math.random()),
    defaultSort,
    pagination = { pageSize: 10, pageSizeOptions: [10, 25, 50, 100] },
    actions,
    emptyState,
    stickyHeader = true,
    className = '',
    rowClassName,
}: DataTableProps<T>) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<string | null>(defaultSort?.columnId || null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction || null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pagination.pageSize || 10);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortColumn || !sortDirection) return data;

        return [...data].sort((a, b) => {
            const column = columns.find((col) => col.id === sortColumn);
            if (!column) return 0;

            let aVal: unknown;
            let bVal: unknown;

            if (typeof column.accessor === 'function') {
                // Skip sorting for custom render functions
                return 0;
            } else {
                aVal = a[column.accessor];
                bVal = b[column.accessor];
            }

            if (aVal === bVal) return 0;
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            const comparison = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [data, sortColumn, sortDirection, columns]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (columnId: string) => {
        if (sortColumn === columnId) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection(null);
                setSortColumn(null);
            }
        } else {
            setSortColumn(columnId);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = paginatedData.map(getRowId);
            const newSelected = new Set([...selectedIds, ...allIds]);
            setSelectedIds(newSelected);
            onSelectionChange?.(Array.from(newSelected));
        } else {
            const pageIds = new Set(paginatedData.map(getRowId));
            const newSelected = new Set([...selectedIds].filter((id) => !pageIds.has(id)));
            setSelectedIds(newSelected);
            onSelectionChange?.(Array.from(newSelected));
        }
    };

    const handleSelectRow = (rowId: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(rowId);
        } else {
            newSelected.delete(rowId);
        }
        setSelectedIds(newSelected);
        onSelectionChange?.(Array.from(newSelected));
    };

    const allPageSelected = paginatedData.length > 0 && paginatedData.every((row) =>
        selectedIds.has(getRowId(row))
    );
    const somePageSelected = paginatedData.some((row) => selectedIds.has(getRowId(row)));

    const getCellValue = (row: T, column: Column<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return row[column.accessor] as React.ReactNode;
    };

    if (data.length === 0 && emptyState) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-gray-200">
                {emptyState.icon && <div className="mb-4">{emptyState.icon}</div>}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {emptyState.title || 'Không có dữ liệu'}
                </h3>
                {emptyState.description && (
                    <p className="text-sm text-gray-500 mb-4">{emptyState.description}</p>
                )}
                {emptyState.action}
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Toolbar */}
            {(selectable || actions) && (
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                        {selectable && selectedIds.size > 0 && (
                            <>
                                <span className="text-sm font-bold" style={{ color: '#000000', fontWeight: '700' }}>
                                    {selectedIds.size} đã chọn
                                </span>
                                {actions?.onDelete && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => actions.onDelete?.(Array.from(selectedIds))}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Xóa
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {actions?.customActions}
                        {actions?.onExport && (
                            <Button variant="outline" size="sm" onClick={actions.onExport} style={{ color: '#000000', fontWeight: '600' }}>
                                <Download className="h-4 w-4 mr-2" />
                                Xuất Excel
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead
                            className={cn(
                                'bg-gray-50 border-b border-gray-200',
                                stickyHeader && 'sticky top-0 z-10'
                            )}
                        >
                            <tr>
                                {selectable && (
                                    <th className="w-12 px-4 py-3 text-left">
                                        <Checkbox
                                            checked={allPageSelected}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.map((column) => (
                                    <th
                                        key={column.id}
                                        className={cn(
                                            'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider',
                                            column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                                            column.headerClassName
                                        )}
                                        style={{
                                            width: column.width,
                                            minWidth: column.minWidth,
                                            color: '#000000',
                                            fontWeight: '700'
                                        }}
                                        onClick={() => column.sortable && handleSort(column.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{column.header}</span>
                                            {column.sortable && (
                                                <span className="text-gray-400">
                                                    {sortColumn === column.id ? (
                                                        sortDirection === 'asc' ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )
                                                    ) : (
                                                        <ChevronsUpDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((row) => {
                                const rowId = getRowId(row);
                                const isSelected = selectedIds.has(rowId);
                                const rowClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

                                return (
                                    <tr
                                        key={rowId}
                                        className={cn(
                                            'hover:bg-gray-50 transition-colors',
                                            isSelected && 'bg-orange-50',
                                            rowClass
                                        )}
                                    >
                                        {selectable && (
                                            <td className="px-4 py-3">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td
                                                key={column.id}
                                                className={cn(
                                                    'px-4 py-3 text-sm font-medium',
                                                    column.cellClassName
                                                )}
                                                style={{ color: '#1a1a1a', fontWeight: '500' }}
                                            >
                                                {getCellValue(row, column)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#000000' }}>
                        <span style={{ color: '#000000', fontWeight: '600' }}>Hiển thị</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20 h-8 font-semibold" style={{ color: '#000000' }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pagination.pageSizeOptions?.map((size) => (
                                    <SelectItem key={size} value={String(size)} className="font-medium" style={{ color: '#000000' }}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span style={{ color: '#000000', fontWeight: '600' }}>
                            trong tổng số <strong style={{ color: '#000000', fontWeight: '700' }}>{sortedData.length}</strong> kết quả
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#000000', fontWeight: '600' }}>
                            Trang <strong style={{ color: '#000000', fontWeight: '700' }}>{currentPage}</strong> / <strong style={{ color: '#000000', fontWeight: '700' }}>{totalPages}</strong>
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
