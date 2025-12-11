"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { TrainingCourseCard } from "./TrainingCourseCard";

interface TrainingCourseListProps {
  courses: TrainingCourse[];
  isLoading: boolean;
  onView: (courseId: number) => void;
  onDelete: (course: TrainingCourse) => void;
  onAssignUsers: (course: TrainingCourse) => void;
  onRefetch: () => void;
  isFetching: boolean;
  getRoleColor: (role: StaffRole) => string;
  getRoleText: (role: StaffRole) => string;
}

export function TrainingCourseList({
  courses,
  isLoading,
  onView,
  onDelete,
  onAssignUsers,
  onRefetch,
  isFetching,
  getRoleColor,
  getRoleText,
}: TrainingCourseListProps) {
  const [displayedCourses, setDisplayedCourses] = useState<TrainingCourse[]>([]);
  const [previousCourseIds, setPreviousCourseIds] = useState<string>("");

  // Hiệu ứng mượt mà khi courses thay đổi
  useEffect(() => {
    const currentCourseIds = courses.map(c => c.id).sort().join(',');
    
    // Chỉ animate khi danh sách thay đổi và không đang fetch
    if (!isFetching && currentCourseIds !== previousCourseIds) {
      // Reset để trigger animation lại
      setDisplayedCourses([]);
      const timer = setTimeout(() => {
        setDisplayedCourses(courses);
        setPreviousCourseIds(currentCourseIds);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isFetching && displayedCourses.length === 0 && courses.length > 0) {
      // Initial load
      setDisplayedCourses(courses);
      setPreviousCourseIds(currentCourseIds);
    }
  }, [courses, isFetching, previousCourseIds]);

  if (isLoading && courses.length === 0) {
    return (
      <Card className="col-span-full flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          <span>Đang tải danh sách khóa đào tạo...</span>
        </div>
      </Card>
    );
  }

  if (!isLoading && courses.length === 0) {
    return (
      <Card className="col-span-full flex flex-col items-center justify-center py-16 text-center space-y-3 border-dashed border-2 border-gray-200">
        <GraduationCap size={36} className="text-gray-400" />
        <div>
          <p className="font-semibold text-gray-700">
            Chưa có khóa đào tạo nào phù hợp
          </p>
          <p className="text-sm text-gray-500">
            Thử điều chỉnh bộ lọc hoặc tạo khóa đào tạo mới.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {displayedCourses.map((course, index) => (
        <div
          key={course.id}
          className="opacity-0 translate-y-4 animate-fade-in-up"
          style={{
            animationDelay: `${index * 50}ms`,
            animationDuration: '500ms',
            animationFillMode: 'forwards',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="h-full">
            <TrainingCourseCard
              course={course}
              onView={onView}
              onDelete={onDelete}
              onAssignUsers={onAssignUsers}
              onRefetch={onRefetch}
              getRoleColor={getRoleColor}
              getRoleText={getRoleText}
            />
          </div>
        </div>
      ))}
      {isFetching && displayedCourses.length > 0 && (
        <div className="col-span-full flex items-center justify-center py-4">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            <span className="text-sm">Đang cập nhật...</span>
          </div>
        </div>
      )}
    </>
  );
}
