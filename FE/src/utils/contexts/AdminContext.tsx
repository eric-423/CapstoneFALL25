'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type TimePeriod = 'today' | '7d' | '30d' | 'custom';

export interface DateRange {
    from: Date;
    to: Date;
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    address?: string;
}

interface AdminContextType {
    // Branch context
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch | null) => void;
    branches: Branch[];
    setBranches: (branches: Branch[]) => void;

    // Time period context
    timePeriod: TimePeriod;
    setTimePeriod: (period: TimePeriod) => void;
    dateRange: DateRange | null;
    setDateRange: (range: DateRange | null) => void;

    // Global search
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
    toggleSearch: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('today');
    const [dateRange, setDateRange] = useState<DateRange | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = useCallback(() => setIsSearchOpen(true), []);
    const closeSearch = useCallback(() => setIsSearchOpen(false), []);
    const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);

    return (
        <AdminContext.Provider
            value={{
                selectedBranch,
                setSelectedBranch,
                branches,
                setBranches,
                timePeriod,
                setTimePeriod,
                dateRange,
                setDateRange,
                isSearchOpen,
                openSearch,
                closeSearch,
                toggleSearch,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
}
