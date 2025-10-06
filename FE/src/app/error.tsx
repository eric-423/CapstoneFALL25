'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6 px-4">
                <div className="flex justify-center">
                    <AlertTriangle className="h-16 w-16 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        Đã xảy ra lỗi
                    </h2>
                    <p className="text-muted-foreground">
                        Có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm font-medium">
                                Chi tiết lỗi (Development)
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                <Button onClick={reset} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Thử lại
                </Button>
            </div>
        </div>
    );
}