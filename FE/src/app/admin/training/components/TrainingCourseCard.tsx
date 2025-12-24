"use client";

import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { TrainingCourse, StaffRole } from "@/utils/types/training.type";

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
  getRoleText,
}: TrainingCourseCardProps) {
  return (
    <Card className="bg-white border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl py-0">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-bold text-[#2D1E1A] line-clamp-1">
                {course.name}
              </h4>
              <p className="text-sm text-[#2D1E1A]/60 line-clamp-2">
                {course.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 flex-shrink-0">
            {course.roleName ? (
              <Badge className="bg-[#DA7339]/20 text-[#DA7339] border-[#DA7339]/30 font-semibold">
                {course.roleName}
              </Badge>
            ) : (
              course.assignedRoles.map((role) => (
                <Badge
                  key={role}
                  className="bg-[#78A243]/20 text-[#78A243] border-[#78A243]/30 font-semibold"
                >
                  {getRoleText(role)}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-nowrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#78A243]/10 rounded-lg flex-shrink-0">
            <BookOpen size={14} className="text-[#78A243]" />
            <span className="text-sm font-semibold text-[#2D1E1A] whitespace-nowrap">
              {course.lessonCount ?? 0} bài học
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EBD187]/30 rounded-lg flex-shrink-0">
            <GraduationCap size={14} className="text-[#DA7339]" />
            <span className="text-sm font-semibold text-[#2D1E1A] whitespace-nowrap">
              Điểm: {course.point ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#78A243]/10 rounded-lg flex-shrink-0">
            <CheckCircle size={14} className="text-[#78A243]" />
            <span className="text-sm font-semibold text-[#2D1E1A] whitespace-nowrap">
              Tổng: {course.totalLessonPoint ?? course.point ?? 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#78A243]/20">
          <Link href={`/admin/training/${course.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="text-[#DA7339] border-[#DA7339]/30 hover:bg-[#DA7339]/10"
            >
              <Edit size={14} className="mr-1" />
              Sửa
            </Button>
          </Link>

          {course.status === "PUBLISHED" && (
            <Link href={`/admin/training/${course.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
              >
                <Eye size={14} className="mr-1" />
                Xem
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssignUsers(course)}
            className="text-[#78A243] border-[#78A243]/30 hover:bg-[#78A243]/10"
          >
            <Users size={14} className="mr-1" />
            Thêm học viên
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(course)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
