"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CheckCircle2, FileText, PlayCircle } from "lucide-react";
import {
  getTrainningById,
  getMyTrainingLessons,
  getLessonDetail,
  getMyLessonDocuments,
  startLesson,
  completeLesson,
  getMyTrainning,
  type TrainingLesson,
  type LessonDocument,
} from "@/apis/trainning.api";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";

export default function TrainingDetailPage() {
  const params = useParams();
  const userTrainingId = Number(params.id);
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: myTrainingsData } = useQuery({
    queryKey: ["my-trainings"],
    queryFn: () => getMyTrainning("ALL"),
  });

  const trainingId = useMemo(() => {
    if (!myTrainingsData?.data || !Array.isArray(myTrainingsData.data)) {
      return null;
    }
    const userTraining = myTrainingsData.data.find(
      (item: { userTrainingId?: number; trainingId?: number }) =>
        item.userTrainingId === userTrainingId
    );
    return userTraining?.trainingId || null;
  }, [myTrainingsData, userTrainingId]);

  const { data: trainingData, isLoading: isLoadingTraining } = useQuery({
    queryKey: ["training", trainingId],
    queryFn: () => getTrainningById(trainingId!),
    enabled: !!trainingId,
  });

  const { data: lessonsData, isLoading: isLoadingLessons } = useQuery({
    queryKey: ["my-training-lessons", trainingId],
    queryFn: () =>
      getMyTrainingLessons(trainingId!, {
        includeDeleted: false,
        page: 0,
        size: 100,
        sortBy: "orderIndex",
        sortDirection: "ASC",
      }),
    enabled: !!trainingId,
  });

  const { data: lessonDetail, isLoading: isLoadingLesson } = useQuery({
    queryKey: ["lesson-detail", selectedLessonId],
    queryFn: () => getLessonDetail(selectedLessonId!),
    enabled: !!selectedLessonId,
  });

  const { data: lessonDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["lesson-documents", selectedLessonId],
    queryFn: () => getMyLessonDocuments(selectedLessonId!),
    enabled: !!selectedLessonId,
  });

  const documents = useMemo<LessonDocument[]>(() => {
    if (!lessonDocuments?.data) return [];
    return lessonDocuments.data;
  }, [lessonDocuments]);

  const startLessonMutation = useMutation({
    mutationFn: (lessonId: number) => {
      if (!userTrainingId) throw new Error("User Training ID not found");
      return startLesson(userTrainingId, lessonId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-detail", selectedLessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-training-lessons", trainingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lesson-documents", selectedLessonId],
      });

      const responseVideoUrl = data?.data?.videoUrl;

      if (responseVideoUrl) {
        setVideoUrl(responseVideoUrl);
      }
    },
  });

  const handleStartLesson = () => {
    if (selectedLessonId) {
      startLessonMutation.mutate(selectedLessonId);
    }
  };

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: number) => {
      if (!userTrainingId) throw new Error("User Training ID not found");
      return completeLesson(userTrainingId, lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-detail", selectedLessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-training-lessons", trainingId],
      });
    },
  });

  const handleCompleteLesson = () => {
    if (selectedLessonId) {
      completeLessonMutation.mutate(selectedLessonId);
    }
  };

  const training = trainingData?.data as
    | {
        id: number;
        name: string;
        description?: string;
        point?: number;
      }
    | undefined;

  const lessons = useMemo<TrainingLesson[]>(() => {
    if (!lessonsData?.data?.content) {
      console.log("📚 No lessons data found:", lessonsData);
      return [];
    }
    console.log("📚 Lessons loaded:", lessonsData.data.content);
    return lessonsData.data.content;
  }, [lessonsData]);

  const isLessonCompleted = (lessonId: number): boolean => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return false;
    const lessonWithStatus = lesson as TrainingLesson & {
      isCompleted?: boolean;
    };
    return lessonWithStatus.isCompleted === true;
  };

  const groupedLessons = useMemo(() => {
    const groups: Record<number, TrainingLesson[]> = {};

    if (lessons.length === 0) {
      console.log("⚠️ No lessons to group");
      return groups;
    }

    groups[1] = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);

    console.log("📦 Grouped lessons:", groups);
    return groups;
  }, [lessons]);

  useEffect(() => {
    const moduleNumbers = Object.keys(groupedLessons)
      .map(Number)
      .sort((a, b) => a - b);
    if (moduleNumbers.length > 0 && expandedModules.size === 0) {
      const firstModule = moduleNumbers[0];
      console.log("🔓 Auto-expanding module:", firstModule);
      setExpandedModules(new Set([firstModule]));
    }
  }, [groupedLessons, expandedModules.size]);

  useEffect(() => {
    if (!selectedLessonId && lessons.length > 0) {
      const firstLesson = lessons.sort(
        (a, b) => a.orderIndex - b.orderIndex
      )[0];
      console.log("🎯 Auto-selecting lesson:", firstLesson.id);
      setSelectedLessonId(firstLesson.id);
    }
  }, [lessons, selectedLessonId]);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setVideoUrl(null);
    setIsVideoCompleted(false);
  }, [selectedLessonId]);

  const toggleModule = (moduleNum: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleNum)) {
        next.delete(moduleNum);
      } else {
        next.add(moduleNum);
      }
      return next;
    });
  };

  if (isLoadingTraining || isLoadingLessons) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#EC6426]" />
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Không tìm thấy khóa học</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            {training.name}
          </h1>
          <p className="text-sm text-gray-500">FPT University</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Tài liệu khóa học
            </h2>
            {lessons.length === 0 && !isLoadingLessons && (
              <p className="text-sm text-gray-500 mt-2">Chưa có bài học nào</p>
            )}
          </div>

          {lessons.length === 0 && !isLoadingLessons ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không có bài học nào trong khóa học này</p>
            </div>
          ) : (
            Object.entries(groupedLessons)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([moduleNum, moduleLessons]) => {
                const moduleNumber = Number(moduleNum);
                const isExpanded = expandedModules.has(moduleNumber);
                const allCompleted = moduleLessons.every((lesson) =>
                  isLessonCompleted(lesson.id)
                );

                return (
                  <div key={moduleNumber} className="mb-2">
                    <button
                      onClick={() => toggleModule(moduleNumber)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors",
                        selectedLessonId &&
                          moduleLessons.some(
                            (l) => l.id === selectedLessonId
                          ) &&
                          "bg-blue-50"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {allCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            selectedLessonId &&
                              moduleLessons.some(
                                (l) => l.id === selectedLessonId
                              )
                              ? "text-blue-600 underline"
                              : "text-gray-900"
                          )}
                        >
                          {training.name}
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {moduleLessons
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .map((lesson) => {
                            const isSelected = selectedLessonId === lesson.id;
                            const isCompleted = isLessonCompleted(lesson.id);

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLessonId(lesson.id)}
                                className={cn(
                                  "w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2",
                                  isSelected &&
                                    "bg-blue-50 border-l-4 border-blue-600"
                                )}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                                )}
                                <span
                                  className={cn(
                                    "text-sm",
                                    isSelected
                                      ? "text-blue-600 font-medium underline"
                                      : "text-gray-700"
                                  )}
                                >
                                  {lesson.title}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoadingLesson ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#EC6426]" />
          </div>
        ) : lessonDetail?.data ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {(lessonDetail.data as TrainingLesson).title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>All videos completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span>All readings completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>All graded assessments completed</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleCompleteLesson}
                  disabled={
                    completeLessonMutation.isPending ||
                    !videoUrl ||
                    !isVideoCompleted
                  }
                >
                  {completeLessonMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang hoàn thành...
                    </>
                  ) : !videoUrl ? (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Vui lòng bắt đầu bài học
                    </>
                  ) : !isVideoCompleted ? (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Vui lòng xem hết video
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {(lessonDetail.data as TrainingLesson).description ||
                    (lessonDetail.data as TrainingLesson).content}
                </p>
              </div>
              <div className="mb-6">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Show Learning Objectives
                </button>
              </div>
              <div className="space-y-4">
                {/* Video Player */}
                {videoUrl ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-black">
                    <div className="w-full aspect-video">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                        onEnded={() => {
                          setIsVideoCompleted(true);
                        }}
                        key={selectedLessonId}
                      >
                        Trình duyệt của bạn không hỗ trợ video tag.
                      </video>
                    </div>
                    {!isVideoCompleted && (
                      <div className="bg-yellow-50 border-t border-yellow-200 p-3">
                        <p className="text-sm text-yellow-800 text-center">
                          ⚠️ Vui lòng xem hết video để có thể hoàn thành bài học
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          {(lessonDetail.data as TrainingLesson).title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600"
                          onClick={handleStartLesson}
                          disabled={startLessonMutation.isPending}
                        >
                          {startLessonMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang bắt đầu...
                            </>
                          ) : (
                            "Get started"
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Video • 8 min</p>
                    <p className="text-sm text-gray-600">
                      {(lessonDetail.data as TrainingLesson).point} điểm
                    </p>
                  </div>
                )}
                {isLoadingDocuments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#EC6426]" />
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tài liệu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((document) => {
                        const isVideo =
                          document.refLink?.includes(".mp4") ||
                          document.refLink?.includes(".mov") ||
                          document.refLink?.includes(".avi");

                        return (
                          <div
                            key={document.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              {isVideo ? (
                                <PlayCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                              ) : (
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 mb-1 truncate">
                                  {document.name}
                                </h4>
                                {document.description && (
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {document.description}
                                  </p>
                                )}
                                <a
                                  href={document.refLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                                >
                                  Xem tài liệu
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Chọn một bài học để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
}
