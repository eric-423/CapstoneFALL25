'use client';

import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';

interface Alert {
    id: number;
    name: string;
    quantity: number;
    unitId: number;
    unitName: string;
    severity: 'high' | 'medium' | 'low';
}

interface AlertsPanelProps {
    alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'high':
                return {
                    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
                    textColor: 'text-red-700',
                    bgColor: 'hover:bg-red-100/50',
                };
            case 'medium':
                return {
                    icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
                    textColor: 'text-orange-700',
                    bgColor: 'hover:bg-orange-100/50',
                };
            case 'low':
                return {
                    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
                    textColor: 'text-yellow-700',
                    bgColor: 'hover:bg-yellow-100/50',
                };
            default:
                return {
                    icon: <Package className="w-4 h-4 text-gray-500" />,
                    textColor: 'text-gray-700',
                    bgColor: 'hover:bg-gray-100/50',
                };
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Cảnh báo tồn kho</h3>
                <Link href="/admin/ingredients" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                    Quản lý
                </Link>
            </div>

            {alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Không có cảnh báo</p>
                </div>
            ) : (
                <div className="space-y-1 flex-1 -mr-2 pr-2 overflow-y-auto">
                    {alerts.map((alert) => {
                        const { icon, textColor, bgColor } = getSeverityStyles(alert.severity);
                        return (
                            <div
                                key={alert.id}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${bgColor} transition-colors`}
                            >
                                {icon}
                                <p className={`flex-1 text-sm font-semibold truncate ${textColor}`}>
                                    {alert.name}
                                </p>
                                <p className="text-xs font-bold text-gray-600">
                                    {alert.quantity} {alert.unitName}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
