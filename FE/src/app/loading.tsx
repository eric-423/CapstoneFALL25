import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function Loading() {
  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}
