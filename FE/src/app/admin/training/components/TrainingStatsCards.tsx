"use client";

import { GraduationCap, CheckCircle, BookOpen, Users } from "lucide-react";
import { AdminStatsCard, AdminStatsGrid } from "../../components/AdminPageLayout";

interface TrainingStatsCardsProps {
  totalCourses: number;
  activeCourses: number;
  totalLessons: number;
  totalLessonPoints: number;
}

export function TrainingStatsCards({
  totalCourses,
  activeCourses,
  totalLessons,
  totalLessonPoints,
}: TrainingStatsCardsProps) {
  return (
    <AdminStatsGrid>
      <AdminStatsCard
        title="Tổng khóa học"
        value={totalCourses}
        icon={GraduationCap}
        iconClassName="from-blue-500 to-cyan-500"
        className="AdminStatsCard"
      />
      <AdminStatsCard
        title="Đang hoạt động"
        value={activeCourses}
        icon={CheckCircle}
        className="AdminStatsCard"
        iconClassName="from-green-500 to-emerald-500"
      />
      <AdminStatsCard
        title="Số bài học"
        value={totalLessons}
        icon={BookOpen}
        className="AdminStatsCard"
        iconClassName="from-purple-500 to-indigo-500"
      />
      <AdminStatsCard
        title="Tổng điểm"
        value={totalLessonPoints}
        icon={Users}
        className="AdminStatsCard"
        iconClassName="from-orange-500 to-red-500"
      />
    </AdminStatsGrid>
  );
}

