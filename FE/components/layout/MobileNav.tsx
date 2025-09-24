import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({
    isOpen,
    onClose,
    className
}) => {
    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when mobile nav is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={onClose}
            />

            {/* Mobile Navigation Drawer */}
            <div className={cn(
                "fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl md:hidden",
                "transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "translate-x-full",
                className
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">T</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900">TamTech</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-4 py-6">
                        <Navigation
                            orientation="vertical"
                            variant="mobile"
                            className="space-y-1"
                        />
                    </div>

                    {/* Auth Actions */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full">
                                Đăng nhập
                            </Button>
                            <Button variant="primary" className="w-full">
                                Đăng ký
                            </Button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-gray-900">Hotline</p>
                            <p className="text-sm text-orange-500 font-semibold">(028) 1234 5678</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileNav;