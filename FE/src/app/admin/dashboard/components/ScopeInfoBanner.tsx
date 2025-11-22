'use client';

import { Calendar, MapPin, Filter } from 'lucide-react';
import { useAdminContext } from '@/utils/contexts/AdminContext';

const timePeriodLabels = {
    today: 'Hôm nay',
    '7d': '7 ngày qua',
    '30d': '30 ngày qua',
    custom: 'Tùy chỉnh',
};

export function ScopeInfoBanner() {
    const { selectedBranch, timePeriod } = useAdminContext();

    return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 flex items-center gap-6 shadow-sm">
            <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Bộ lọc đang áp dụng:</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm">
                <MapPin className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-800">
                    {selectedBranch ? selectedBranch.name : 'Tất cả chi nhánh'}
                </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-800">
                    {timePeriodLabels[timePeriod]}
                </span>
            </div>

            <div className="ml-auto text-xs text-gray-500">
                Dữ liệu được lọc theo các tiêu chí trên
            </div>
        </div>
    );
}
