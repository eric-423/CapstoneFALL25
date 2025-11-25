"use client";

import Image from "next/image";
import {
  GraduationCap,
  Edit,
  Eye,
  Trash2,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";
import { AddTrainingDialog } from "./AddTrainingDialog";

interface TrainingCourseCardProps {
  course: TrainingCourse;
  onView: (courseId: number) => void;
  onDelete: (course: TrainingCourse) => void;
  onAssignUsers: (course: TrainingCourse) => void;
  onRefetch: () => void;
  getRoleColor: (role: StaffRole) => string;
  getRoleText: (role: StaffRole) => string;
}

export function TrainingCourseCard({
  course,
  onView,
  onDelete,
  onAssignUsers,
  onRefetch,
  getRoleColor,
  getRoleText,
}: TrainingCourseCardProps) {
  return (
    <Card className="bg-[#fbdcc5] border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group">
      <div className="flex gap-6 p-6">
        <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap
                size={32}
                className="text-gray-400"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {course.name}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                {course.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {course.roleName ? (
                <span className="px-3 py-1.5 bg-[#7c4d40] text-[#EFE6DB] text-xs font-bold rounded-xl shadow-md">
                  {course.roleName}
                </span>
              ) : (
                course.assignedRoles.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1.5 bg-gradient-to-r ${getRoleColor(
                      role
                    )} text-white text-xs font-bold rounded-xl shadow-md`}
                  >
                    {getRoleText(role)}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#e0f2ff] rounded-xl border border-[#e0f2ff]">
              <BookOpen size={16} className="text-[#007bff]" strokeWidth={2.5} />
              <p className="text-sm text-gray-700 font-semibold">
                {course.lessonCount ?? 0} bài học
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#e0f2ff] rounded-xl border border-[#e0f2ff]">
              <GraduationCap
                size={16}
                className="text-[#007bff]"
                strokeWidth={2.5}
              />
              <p className="text-sm text-gray-700 font-semibold">
                Điểm: {course.point ?? 0}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#e0f2ff] rounded-xl border border-[#e0f2ff]">
              <CheckCircle
                size={16}
                className="text-[#007bff]"
                strokeWidth={2.5}
              />
              <p className="text-sm text-gray-700 font-semibold">
                Tổng: {course.totalLessonPoint ?? course.point ?? 0}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-3 border-t-2 border-gray-100">
            <AddTrainingDialog
              mode="edit"
              training={course}
              onSuccess={onRefetch}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary bg-white font-semibold rounded-xl transition-all"
                >
                  <Edit size={16} className="mr-1 text-primary" strokeWidth={2.5} />
                  Sửa
                </Button>
              }
            />

            {course.status === "PUBLISHED" && (
              <Button
                size="sm"
                variant="outline"
                className="text-primary bg-white font-semibold rounded-xl transition-all"
                onClick={() => onView(course.id)}
              >
                <Eye size={16} className="mr-1 text-primary" strokeWidth={2.5} />
                Xem
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignUsers(course)}
              className="text-primary bg-white font-semibold rounded-xl transition-all"
              title="Thêm người dùng vào khóa đào tạo"
            >
              <Users size={16} className="mr-1 text-primary" strokeWidth={2.5} />
              Thêm học viên
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(course)}
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

