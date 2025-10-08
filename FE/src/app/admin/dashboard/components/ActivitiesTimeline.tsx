'use client';

import React from 'react';
import { BookOpen, GraduationCap, Package, AlertTriangle, ShoppingBag, Activity } from 'lucide-react';

interface ActivityItem {
    id: number;
    type: 'recipe' | 'training' | 'ingredient' | 'alert' | 'order';
    message: string;
    timestamp: string;
    icon: string;
}

interface ActivitiesTimelineProps {
    activities: ActivityItem[];
}

export function ActivitiesTimeline({ activities }: ActivitiesTimelineProps) {
    const getIcon = (iconName: string) => {
        const iconClass = 'w-4 h-4';
        switch (iconName) {
            case 'BookOpen':
                return <BookOpen className={iconClass} />;
            case 'GraduationCap':
                return <GraduationCap className={iconClass} />;
            case 'Package':
                return <Package className={iconClass} />;
            case 'AlertTriangle':
                return <AlertTriangle className={iconClass} />;
            case 'ShoppingBag':
                return <ShoppingBag className={iconClass} />;
            default:
                return <Activity className={iconClass} />;
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'recipe':
                return 'bg-blue-100 text-blue-600 border-blue-300';
            case 'training':
                return 'bg-purple-100 text-purple-600 border-purple-300';
            case 'ingredient':
                return 'bg-green-100 text-green-600 border-green-300';
            case 'alert':
                return 'bg-red-100 text-red-600 border-red-300';
            case 'order':
                return 'bg-orange-100 text-orange-600 border-orange-300';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 relative">
                        {/* Timeline line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[18px] top-10 w-0.5 h-full bg-gray-200" />
                        )}

                        {/* Icon */}
                        <div
                            className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center ${getTypeStyles(
                                activity.type
                            )} shadow-sm`}
                        >
                            {getIcon(activity.icon)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                            <p className="text-sm text-gray-800 mb-1">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>

            {activities.length === 0 && (
                <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Chưa có hoạt động</p>
                </div>
            )}
        </div>
    );
}
