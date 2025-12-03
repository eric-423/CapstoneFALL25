"use client";

import { GraduationCap, CheckCircle, BookOpen, Award } from "lucide-react";
import { AdminCard } from "../../components/AdminCard";

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <AdminCard
        title="Tổng khóa học"
        value={totalCourses}
        icon={GraduationCap}
        subtitle="Khóa đào tạo trong hệ thống"
      />
      <AdminCard
        title="Đang hoạt động"
        value={activeCourses}
        icon={CheckCircle}
        subtitle="Khóa học đang mở"
      />
      <AdminCard
        title="Số bài học"
        value={totalLessons}
        icon={BookOpen}
        subtitle="Tổng bài học"
      />
      <AdminCard
        title="Tổng điểm"
        value={totalLessonPoints}
        icon={Award}
        subtitle="Điểm tích lũy"
      />
    </div>
  );
}

