"use client";

import { useEffect, useState } from "react";
import {
  getTrainingLessons,
  TrainingLesson,
  getLessonDetail,
} from "@/apis/trainning.api";

interface LessonsPagination {
  page: number;
  size: number;
  includeDeleted: boolean;
}

interface LessonsData {
  items: TrainingLesson[];
  totalPages: number;
  totalElements: number;
}

export function useLessons(
  trainingId: number | null,
  pagination: LessonsPagination,
  refreshKey: number
) {
  const [lessonsData, setLessonsData] = useState<LessonsData>({
    items: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainingId) {
      setLessonsData({ items: [], totalPages: 0, totalElements: 0 });
      return;
    }

    let ignore = false;

    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTrainingLessons(trainingId, {
          includeDeleted: pagination.includeDeleted,
          page: pagination.page,
          size: pagination.size,
          sortBy: "id",
          sortDirection: "ASC",
        });

        if (ignore) return;

        const data = response?.data;
        setLessonsData({
          items: data?.content ?? [],
          totalPages: data?.totalPages ?? 0,
          totalElements: data?.totalElements ?? 0,
        });
      } catch (err) {
        if (ignore) return;
        const serverDesc =
          (err as { response?: { data?: { desc?: string; error?: string } } })
            ?.response?.data?.desc ||
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error ||
          (err instanceof Error
            ? err.message
            : "Không thể tải danh sách bài học");
        setError(serverDesc);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchLessons();
    return () => {
      ignore = true;
    };
  }, [
    trainingId,
    pagination.includeDeleted,
    pagination.page,
    pagination.size,
    refreshKey,
  ]);

  return {
    lessonsData,
    loading,
    error,
  };
}

export function useLessonDetail(lessonId: number | null) {
  const [lesson, setLesson] = useState<TrainingLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setLesson(null);
      return;
    }

    let ignore = false;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getLessonDetail(lessonId);

        if (ignore) return;

        setLesson(response?.data ?? null);
      } catch (err) {
        if (ignore) return;
        const serverDesc =
          (err as { response?: { data?: { desc?: string; error?: string } } })
            ?.response?.data?.desc ||
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error ||
          (err instanceof Error
            ? err.message
            : "Không thể tải chi tiết bài học");
        setError(serverDesc);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchLesson();
    return () => {
      ignore = true;
    };
  }, [lessonId]);

  return { lesson, loading, error };
}

