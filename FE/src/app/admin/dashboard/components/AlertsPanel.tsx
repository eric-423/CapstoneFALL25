'use client';

import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';

interface Alert {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    threshold: number;
    severity: 'high' | 'medium' | 'low';
}

interface AlertsPanelProps {
    alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-700';
            case 'medium':
                return 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700';
            case 'low':
                return 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700';
            default:
                return 'border-gray-300 bg-gray-50 text-gray-700';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'medium':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'low':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Cảnh báo tồn kho</h3>
                </div>
                <Link
                    href="/admin/ingredients"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    Quản lý →
                </Link>
            </div>

            {alerts.length === 0 ? (
                <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Không có cảnh báo</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg border-2 ${getSeverityStyles(alert.severity)} transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start gap-3">
                                {getSeverityIcon(alert.severity)}
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{alert.name}</h4>
                                    <p className="text-sm opacity-80">
                                        Còn lại: <span className="font-bold">{alert.quantity}{alert.unit}</span>
                                        {' '} / Ngưỡng: {alert.threshold}{alert.unit}
                                    </p>
                                    <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${alert.severity === 'high'
                                                    ? 'bg-red-500'
                                                    : alert.severity === 'medium'
                                                        ? 'bg-orange-500'
                                                        : 'bg-yellow-500'
                                                }`}
                                            style={{
                                                width: `${Math.min((alert.quantity / alert.threshold) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
