'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

interface TimePeriodSelectorProps {
    selectedPeriod: 'day' | 'week' | 'month' | 'year';
    onPeriodChange: (period: 'day' | 'week' | 'month' | 'year') => void;
}

export function TimePeriodSelector({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) {
    const periods = [
        { value: 'day' as const, label: '7 ngày', icon: Clock },
        { value: 'week' as const, label: '4 tuần', icon: Calendar },
        { value: 'month' as const, label: '12 tháng', icon: Calendar },
        { value: 'year' as const, label: '5 năm', icon: Calendar },
    ];

    return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 px-2">Thời gian:</span>
            <div className="flex gap-2">
                {periods.map(({ value, label, icon: Icon }) => (
                    <Button
                        key={value}
                        variant={selectedPeriod === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPeriodChange(value)}
                        className={`
                            transition-all duration-300 rounded-lg font-semibold text-xs
                            ${selectedPeriod === value
                                ? 'bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white shadow-md hover:shadow-lg border-0'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#EC6426]'
                            }
                        `}
                    >
                        <Icon size={14} className="mr-1.5" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
