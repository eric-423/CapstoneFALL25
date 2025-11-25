"use client";

import { GraduationCap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { TrainingCourseCard } from "./TrainingCourseCard";
import { AddTrainingDialog } from "./AddTrainingDialog";

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
        <div className="flex gap-3">
          <Button variant="outline" onClick={onRefetch}>
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
              strokeWidth={2.5}
            />
            Tải lại
          </Button>
          <AddTrainingDialog onSuccess={onRefetch} />
        </div>
      </Card>
    );
  }

  return (
    <>
      {courses.map((course) => (
        <TrainingCourseCard
          key={course.id}
          course={course}
          onView={onView}
          onDelete={onDelete}
          onAssignUsers={onAssignUsers}
          onRefetch={onRefetch}
          getRoleColor={getRoleColor}
          getRoleText={getRoleText}
        />
      ))}
    </>
  );
}

