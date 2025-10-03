import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function Loading() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner />
                <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
        </div>
    );
}