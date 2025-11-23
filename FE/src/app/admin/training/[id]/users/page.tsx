"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { AdminGuard } from "@/components/guards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageLayout } from "../../../components/AdminPageLayout";
import { getTrainingUsers, type TrainingUserItem } from "@/apis/trainning.api";
import { getTrainningById } from "@/apis/trainning.api";

export default function TrainingUsersPage() {
  const params = useParams();
  const router = useRouter();
  const trainingId = Number(params.id);

  const [trainingName, setTrainingName] = useState<string>("");
  const { data: trainingData } = useQuery({
    queryKey: ["training", trainingId],
    queryFn: async () => {
      try {
        const payload = await getTrainningById(trainingId);
        return payload;
      } catch (error) {
        console.error("Failed to fetch training:", error);
        return null;
      }
    },
    enabled: !!trainingId,
  });

  useEffect(() => {
    if (trainingData) {
      const training = trainingData as {
        data?: { name?: string };
        name?: string;
      };
      const name = training?.data?.name || training?.name || "Khóa đào tạo";
      setTrainingName(name);
    }
  }, [trainingData]);
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["training-users", trainingId],
    queryFn: async () => {
      try {
        const response = await getTrainingUsers(trainingId);
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch training users:", error);
        throw error;
      }
    },
    enabled: !!trainingId,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      NOT_STARTED: {
        label: "Chưa bắt đầu",
        className: "bg-gray-100 text-gray-700",
      },
      IN_PROGRESS: {
        label: "Đang học",
        className: "bg-blue-100 text-blue-700",
      },
      COMPLETED: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
      },
      FAILED: {
        label: "Không đạt",
        className: "bg-red-100 text-red-700",
      },
    };

    const config = statusConfig[status] || statusConfig.NOT_STARTED;
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminPageLayout>
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">
              Đang tải danh sách học viên...
            </span>
          </div>
        </AdminPageLayout>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <AdminPageLayout>
          <div className="flex flex-col items-center justify-center py-20">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Không thể tải danh sách học viên
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Đã xảy ra lỗi"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Thử lại
            </Button>
          </div>
        </AdminPageLayout>
      </AdminGuard>
    );
  }

  const users = usersData || [];

  return (
    <AdminGuard>
      <AdminPageLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Danh sách học viên
                </h1>
                <p className="text-sm text-gray-600 mt-1">{trainingName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">
                Tổng: {users.length} học viên
              </span>
            </div>
          </div>

          {users.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có học viên nào
              </p>
              <p className="text-sm text-gray-600">
                Khóa đào tạo này chưa có học viên được gán.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {users.map((user: TrainingUserItem) => (
                <Card
                  key={user.id}
                  className="p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.userFullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {user.userFullName}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{user.userEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{user.userPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">
                            Điểm:{" "}
                            <span className="font-semibold text-gray-900">
                              {user.point}/{user.trainingPoint}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">
                            Bài học:{" "}
                            <span className="font-semibold text-gray-900">
                              {user.completedLessons}/{user.totalLessons}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            {user.isPassed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {user.isPassed ? "Đã đạt" : "Chưa đạt"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">
                            Đăng ký: {formatDate(user.enrolledAt)}
                          </span>
                        </div>
                        {user.completedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              Hoàn thành: {formatDate(user.completedAt)}
                            </span>
                          </div>
                        )}
                        <div>{getStatusBadge(user.status)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        Tiến độ hoàn thành
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        {user.completionPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${user.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminPageLayout>
    </AdminGuard>
  );
}
