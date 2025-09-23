import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

export interface MainLayoutProps {
    children: React.ReactNode;
    className?: string;
    showHeader?: boolean;
    showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    className,
    showHeader = true,
    showFooter = true
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            {showHeader && <Header />}

            <main className={cn(
                "flex-1",
                className
            )}>
                {children}
            </main>

            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;