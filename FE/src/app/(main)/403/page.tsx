'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <ShieldX className="h-24 w-24 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">403</h1>
                    <h2 className="text-xl font-semibold text-foreground">
                        Truy cập bị từ chối
                    </h2>
                    <p className="text-muted-foreground">
                        Bạn không có quyền truy cập vào trang này.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button asChild className="w-full">
                        <Link href="/">
                            Về trang chủ
                        </Link>
                    </Button>

                    <Button variant="outline" asChild className="w-full">
                        <Link href="/login">
                            Đăng nhập
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}