"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
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
import { Loader2 } from "lucide-react";

export default function TrainingDetailPage() {
  const params = useParams();
  const paramsId = Number(params.id);
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isVideoSeeking, setIsVideoSeeking] = useState(false);
  const wasPlayingBeforeSeek = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: myTrainingsData } = useQuery({
    queryKey: ["my-trainings"],
    queryFn: () => getMyTrainning("ALL"),
    refetchInterval: 10000,
  });

  const userTrainingId = useMemo(() => {
    if (!myTrainingsData?.data || !Array.isArray(myTrainingsData.data)) {
      return paramsId;
    }
    const userTraining = myTrainingsData.data.find(
      (item: { userTrainingId?: number; id?: number; trainingId?: number }) =>
        item.userTrainingId === paramsId || item.id === paramsId
    );
    if (userTraining) {
      return userTraining.userTrainingId ?? userTraining.id ?? paramsId;
    }
    return paramsId;
  }, [myTrainingsData, paramsId]);

  const trainingId = useMemo(() => {
    if (!myTrainingsData?.data || !Array.isArray(myTrainingsData.data)) {
      return null;
    }
    const userTraining = myTrainingsData.data.find(
      (item: { userTrainingId?: number; id?: number; trainingId?: number }) =>
        item.userTrainingId === userTrainingId || item.id === userTrainingId
    );
    return userTraining?.trainingId || null;
  }, [myTrainingsData, userTrainingId]);

  const { data: trainingData, isLoading: isLoadingTraining } = useQuery({
    queryKey: ["training", trainingId],
    queryFn: () => getTrainningById(trainingId!),
    enabled: !!trainingId,
    refetchOnWindowFocus: true,
    retry: 2,
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
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchInterval: 5000,
    gcTime: 0,
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
        toast.success("Đã bắt đầu bài học!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Không thể bắt đầu bài học. Vui lòng thử lại!",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
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
      queryClient.invalidateQueries({
        queryKey: ["my-trainings"],
      });
      toast.success("Chúc mừng! Bạn đã hoàn thành bài học này!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Không thể hoàn thành bài học. Vui lòng thử lại!",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
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
    if (!lessonsData?.data?.lessons) {
      return [];
    }
    return lessonsData.data.lessons;
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
      return groups;
    }

    groups[1] = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);

    console.log("📦 Grouped lessons:", groups);
    return groups;
  }, [lessons]);

  const completedLessonsCount = useMemo(() => {
    if (lessonsData?.data?.completedLessons !== undefined) {
      return lessonsData.data.completedLessons;
    }
    return lessons.filter((lesson) => {
      const lessonWithStatus = lesson as TrainingLesson & {
        isCompleted?: boolean;
      };
      return lessonWithStatus.isCompleted === true;
    }).length;
  }, [lessons, lessonsData?.data?.completedLessons]);

  const courseProgress = useMemo(() => {
    const total = lessonsData?.data?.totalLessons ?? lessons.length;
    if (total === 0) return 0;
    return Math.round((completedLessonsCount / total) * 100);
  }, [completedLessonsCount, lessons.length, lessonsData?.data?.totalLessons]);

  const currentLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    return lessons.find((lesson) => lesson.id === selectedLessonId) ?? null;
  }, [lessons, selectedLessonId]);

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
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#f8e4d4" }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#EC6426]" />
      </div>
    );
  }

  if (!training) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#f8e4d4" }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#EC6426]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Nội dung học
            </p>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {training.name}
            </h1>
            {training.description && (
              <p className="mt-1 max-w-3xl text-xs text-gray-600 line-clamp-1">
                {training.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                <span>
                  {completedLessonsCount}/{lessons.length || "0"} bài học
                  {currentLesson && (
                    <span className="ml-2 text-gray-500">
                      • Đang học: {currentLesson.title}
                    </span>
                  )}
                </span>
                <span className="font-semibold text-gray-900">
                  {courseProgress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#EC6426] transition-all duration-300"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ml-2 grid max-w-8xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8 bg-[#FFFCF7] h-100vh">
        <aside className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Nội dung khóa học
            </p>
            <p className="text-sm text-gray-600 mt-1">
              • {lessons.length} bài học
            </p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto bg-white rounded-b-2xl px-4 py-4">
            {lessons.length === 0 && !isLoadingLessons ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Không có bài học nào trong khóa học này
                </p>
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
                    <div key={moduleNumber} className="mb-3">
                      {isExpanded && (
                        <div>
                          {moduleLessons
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((lesson) => {
                              const isSelected = selectedLessonId === lesson.id;
                              const isCompleted = isLessonCompleted(lesson.id);

                              return (
                                <Button
                                  key={lesson.id}
                                  variant="ghost"
                                  onClick={() => setSelectedLessonId(lesson.id)}
                                  className={cn(
                                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-all justify-start mt-2",
                                    isSelected
                                      ? "bg-white shadow-sm border border-[#EC6426]/40 text-[#EC6426] font-medium"
                                      : "bg-white/50 hover:bg-white hover:border hover:border-[#EC6426]/20 text-gray-700 border border-transparent"
                                  )}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border border-gray-300 flex-shrink-0" />
                                    )}
                                    <span className="truncate text-left">
                                      {lesson.title}
                                    </span>
                                  </div>
                                </Button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </aside>

        <main className="space-y-6">
          {isLoadingLesson ? (
            <div className="space-y-6">
              <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="h-20 w-full bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-gray-200 rounded" />
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-64 w-full bg-gray-200 rounded-2xl" />
              </section>
            </div>
          ) : lessonDetail?.data ? (
            <>
              <section className="space-y-10 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Bài học hiện tại
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                      {(lessonDetail.data as TrainingLesson).title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      {(lessonDetail.data as TrainingLesson).description ||
                        (lessonDetail.data as TrainingLesson).content}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handleStartLesson}
                      disabled={startLessonMutation.isPending}
                    >
                      {startLessonMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang chuẩn bị
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Bắt đầu
                        </>
                      )}
                    </Button>
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
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang hoàn thành...
                        </>
                      ) : !videoUrl ? (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Bắt đầu bài học
                        </>
                      ) : !isVideoCompleted ? (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Xem hết video
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Hoàn thành
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 h-[54vh]">
                  {videoUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
                      <div className="aspect-video w-full">
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          autoPlay
                          preload="auto"
                          playsInline
                          className="h-full w-full"
                          onEnded={() => {
                            setIsVideoCompleted(true);
                          }}
                          onSeeking={() => {
                            setIsVideoSeeking(true);
                            if (videoRef.current) {
                              wasPlayingBeforeSeek.current =
                                !videoRef.current.paused;
                            }
                          }}
                          onSeeked={async () => {
                            setIsVideoSeeking(false);

                            if (
                              videoRef.current &&
                              wasPlayingBeforeSeek.current
                            ) {
                              try {
                                await videoRef.current.play();
                              } catch (error) {
                                console.error(
                                  "Error playing video after seek:",
                                  error
                                );

                                setTimeout(async () => {
                                  if (
                                    videoRef.current &&
                                    wasPlayingBeforeSeek.current
                                  ) {
                                    try {
                                      await videoRef.current.play();
                                    } catch (err) {
                                      console.error("Retry play failed:", err);
                                    }
                                  }
                                }, 200);
                              }
                            }
                            wasPlayingBeforeSeek.current = false;
                          }}
                          onLoadedData={() => {
                            if (
                              videoRef.current &&
                              !isVideoSeeking &&
                              videoRef.current.paused
                            ) {
                              videoRef.current.play().catch((error) => {
                                console.error(
                                  "Error playing video after load:",
                                  error
                                );
                              });
                            }
                          }}
                          onCanPlay={() => {
                            if (
                              videoRef.current &&
                              !isVideoSeeking &&
                              videoRef.current.paused
                            ) {
                              videoRef.current.play().catch((error) => {
                                console.error(
                                  "Error playing video when ready:",
                                  error
                                );
                              });
                            }
                          }}
                          onWaiting={() => {}}
                          onPlaying={() => {
                            setIsVideoSeeking(false);
                          }}
                          onPause={() => {}}
                          key={selectedLessonId}
                        >
                          Trình duyệt của bạn không hỗ trợ video tag.
                        </video>
                      </div>
                      {!isVideoCompleted && (
                        <div className="border-t border-gray-200 bg-yellow-50 p-3 text-center text-sm text-yellow-800">
                          Xem hết video để mở khóa nút hoàn thành.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                      <div className="aspect-video w-full flex flex-col items-center justify-center p-6 h-[54vh]">
                        <PlayCircle className="h-10 w-10 text-gray-400" />
                        <p className="mt-3 text-sm text-gray-600">
                          Video sẽ xuất hiện tại đây sau khi bạn bắt đầu bài
                          học.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {isLoadingDocuments ? (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-6 w-48 bg-gray-200 rounded" />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-200 p-4 space-y-3"
                      >
                        <div className="h-5 w-5 bg-gray-200 rounded" />
                        <div className="h-5 w-3/4 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                documents.length > 0 && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Tài liệu học tập
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Nội dung bổ trợ cho bài học
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        {documents.length} tài liệu
                      </span>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {documents.map((document) => {
                        const isVideo =
                          document.refLink?.includes(".mp4") ||
                          document.refLink?.includes(".mov") ||
                          document.refLink?.includes(".avi");

                        return (
                          <div
                            key={document.id}
                            className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              {isVideo ? (
                                <PlayCircle className="mt-1 h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="mt-1 h-5 w-5 text-gray-600" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {document.name}
                                </p>
                                {document.description && (
                                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                    {document.description}
                                  </p>
                                )}
                                <a
                                  href={document.refLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center text-sm font-medium text-[#EC6426] hover:text-[#c94f1f]"
                                >
                                  Mở tài liệu
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )
              )}
            </>
          ) : (
            <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
              <p className="text-sm text-gray-500">
                Chọn một bài học ở bảng bên trái để bắt đầu học.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
