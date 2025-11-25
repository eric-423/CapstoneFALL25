"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTrainnings,
  GetTrainningsData,
  TrainingResponse,
} from "@/apis/trainning.api";
import {
  extractTrainingList,
  mapTrainingCourse,
} from "../../utils/trainingUtils";

const TRAINING_PAGE_SIZE = 50;

export function useTrainingData(searchQuery: string) {
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: trainingResponse,
    isLoading: isLoadingTrainings,
    isFetching: isFetchingTrainings,
    error: trainingsError,
    refetch,
  } = useQuery<TrainingResponse, Error>({
    queryKey: ["admin-trainings", debouncedSearch],
    queryFn: async () => {
      const payload: GetTrainningsData = {
        includeInactive: true,
        page: 0,
        size: TRAINING_PAGE_SIZE,
        sortBy: "createdAt",
        sortDirection: "ASC",
      };

      if (debouncedSearch) {
        payload.keyword = debouncedSearch;
      }

      return getTrainnings(payload);
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (trainingsError) {
      const message =
        trainingsError instanceof Error
          ? trainingsError.message
          : "Không thể tải danh sách khóa đào tạo";
      console.error("Tải khóa đào tạo thất bại:", message);
    }
  }, [trainingsError]);

  const courses = useMemo(
    () => extractTrainingList(trainingResponse).map(mapTrainingCourse),
    [trainingResponse]
  );

  const statusCounts = useMemo(
    () => ({
      all: courses.length,
      PUBLISHED: courses.filter((course) => course.status === "PUBLISHED")
        .length,
      DRAFT: courses.filter((course) => course.status === "DRAFT").length,
      ARCHIVED: courses.filter((course) => course.status === "ARCHIVED")
        .length,
    }),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesStatus = true; // Will be filtered by parent
      const matchesSearch = query
        ? course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          (course.recipeName?.toLowerCase().includes(query) ?? false)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [courses, searchQuery]);

  const totalCourses = statusCounts.all;
  const activeCourses = courses.filter(
    (course) => course.status === "PUBLISHED" || course.isActive
  ).length;
  const totalLessons = courses.reduce(
    (sum, c) => sum + (c.lessonCount ?? 0),
    0
  );
  const totalLessonPoints = courses.reduce(
    (sum, c) => sum + (c.totalLessonPoint ?? c.point ?? 0),
    0
  );

  const statuses = [
    { value: "all", label: "Tất cả", count: statusCounts.all },
    {
      value: "PUBLISHED",
      label: "Đã xuất bản",
      count: statusCounts.PUBLISHED,
    },
    {
      value: "DRAFT",
      label: "Nháp",
      count: statusCounts.DRAFT,
    },
    {
      value: "ARCHIVED",
      label: "Lưu trữ",
      count: statusCounts.ARCHIVED,
    },
  ];

  return {
    courses,
    filteredCourses,
    statuses,
    totalCourses,
    activeCourses,
    totalLessons,
    totalLessonPoints,
    isLoadingTrainings,
    isFetchingTrainings,
    refetch,
  };
}

