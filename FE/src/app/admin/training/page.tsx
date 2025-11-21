'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
    GraduationCap,
    Search,
    Edit,
    Trash2,
    Users,
    CheckCircle,
    BookOpen,
    Eye,
    Send,
    RefreshCw,
    Plus,
    ArrowLeft,
    ExternalLink,
    FileText,
} from 'lucide-react';

import { useQuery } from '@tanstack/react-query';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    getTrainnings,
    GetTrainningsData,
    TrainingResponse,
    getTrainningById,
    deleteTraining,
    getTrainingLessons,
    TrainingLesson,
    getLessonDetail,
    createLesson,
    CreateLessonPayload,
    updateLesson,
    getLessonDocuments,
    LessonDocument,
    createLessonDocument,
    CreateDocumentPayload,
    updateLessonDocument,
    deleteLessonDocument,
} from '@/apis/trainning.api';
import { TrainingCourse, StaffRole } from '@/utils/types/training.type';
import { AddTrainingDialog } from '@/app/admin/training/components/AddTrainingDialog';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';

const TRAINING_PAGE_SIZE = 50;
const TRAINING_LESSON_PAGE_SIZE = 5;

type RoleLike =
    | string
    | {
        name?: string;
        role?: string;
        code?: string;
        roleName?: string;
        roleCode?: string;
    };

interface MediaResource {
    url?: string;
}

interface RecipeInfo {
    id?: number;
    name?: string;
}

interface TrainingApiItem {
    id?: number;
    trainingId?: number;
    name?: string;
    title?: string;
    description?: string;
    summary?: string;
    note?: string;
    recipeId?: number;
    recipe?: RecipeInfo | null;
    recipeName?: string;
    assignedRoles?: RoleLike[];
    trainingRoles?: RoleLike[];
    trainingRoleResponses?: RoleLike[];
    roles?: RoleLike[];
    roleName?: string;
    roleId?: number;
    videoUrl?: string;
    video?: string;
    videos?: MediaResource[];
    documentUrl?: string;
    documents?: MediaResource[];
    duration?: number;
    durationMinutes?: number;
    estimatedDuration?: number;
    lessonCount?: number;
    totalLessonPoint?: number;
    sumLessonPoint?: number;
    totalLessons?: number;
    status?: string;
    isActive?: boolean;
    publishedAt?: string;
    updateDate?: string;
    createdAt?: string;
    enrolledCount?: number;
    totalEnrolled?: number;
    userTrainings?: unknown[];
    completedCount?: number;
    totalCompleted?: number;
    thumbnail?: string;
    thumbnailUrl?: string;
    coverImage?: string;
    point?: number;
    basePoint?: number;
    trainingRoleId?: number;
    role?: {
        id?: number;
        roleId?: number;
        name?: string;
        roleName?: string;
    } | null;
}

const normalizeRole = (role?: string): StaffRole => {
    if (!role) return 'ALL';
    const normalized = role.toUpperCase();
    if (normalized.includes('CHEF') || normalized.includes('KITCHEN')) return 'CHEF';
    if (normalized.includes('MANAGER')) return 'BRANCH_MANAGER';
    if (normalized.includes('WAITER') || normalized.includes('SERVICE')) return 'WAITER';
    if (normalized.includes('SHIP')) return 'SHIPPER';
    if (normalized.includes('STAFF')) return 'STAFF';
    return 'ALL';
};

const isStaffRole = (role: StaffRole | undefined): role is StaffRole => Boolean(role);

const mapBackendStatusToCourseStatus = (
    status?: string,
    isActive?: boolean
): TrainingCourse['status'] => {
    const normalized = status?.toUpperCase();
    if (normalized === 'PUBLISHED' || normalized === 'ACTIVE') return 'PUBLISHED';
    if (normalized === 'ARCHIVED' || normalized === 'INACTIVE') return 'ARCHIVED';
    if (normalized === 'DRAFT') return 'DRAFT';
    if (typeof isActive === 'boolean') {
        return isActive ? 'PUBLISHED' : 'ARCHIVED';
    }
    return 'DRAFT';
};

type TrainingListPayload = {
    content?: TrainingApiItem[];
    data?: TrainingApiItem[];
    items?: TrainingApiItem[];
};

interface TrainingDetailState {
    open: boolean;
    isLoading: boolean;
    training: TrainingCourse | null;
    error: string | null;
}

const extractTrainingList = (response?: TrainingResponse | null): TrainingApiItem[] => {
    if (!response) return [];
    const dataLayer = response.data as TrainingListPayload | TrainingApiItem[] | null | undefined;
    if (!dataLayer) return [];
    if (Array.isArray(dataLayer)) return dataLayer;
    if (Array.isArray(dataLayer.content)) return dataLayer.content;
    if (Array.isArray(dataLayer.data)) return dataLayer.data;
    if (Array.isArray(dataLayer.items)) return dataLayer.items;
    return [];
};

const extractTrainingDetail = (payload: unknown): TrainingApiItem | null => {
    if (!payload || typeof payload !== 'object') return null;
    const possible = payload as { data?: TrainingApiItem | null };
    if (possible.data) {
        return possible.data;
    }
    return payload as TrainingApiItem;
};

const mapTrainingCourse = (item: TrainingApiItem): TrainingCourse => {
    let rawRoles: RoleLike[] = [];

    if (Array.isArray(item.assignedRoles)) {
        rawRoles = item.assignedRoles;
    } else if (Array.isArray(item.trainingRoles)) {
        rawRoles = item.trainingRoles;
    } else if (Array.isArray(item.trainingRoleResponses)) {
        rawRoles = item.trainingRoleResponses;
    } else if (Array.isArray(item.roles)) {
        rawRoles = item.roles;
    }

    if (!rawRoles.length && (item.roleName || item.roleId)) {
        rawRoles = [item.roleName || `ROLE_${item.roleId}`];
    }

    const normalizedRoles = rawRoles
        .map((role) =>
            normalizeRole(
                typeof role === 'string'
                    ? role
                    : role?.name || role?.role || role?.code || role?.roleName || role?.roleCode
            )
        )
        .filter(isStaffRole);

    const derivedRoles: StaffRole[] = normalizedRoles.length ? normalizedRoles : ['ALL'];

    return {
        id: Number(item.id ?? item.trainingId ?? Date.now()),
        name: item.name ?? item.title ?? 'Khóa đào tạo',
        description: item.description ?? item.summary ?? item.note ?? 'Chưa có mô tả',
        note: item.note ?? item.description ?? undefined,
        recipeId: item.recipeId ?? item.recipe?.id,
        recipeName: item.recipeName ?? item.recipe?.name,
        assignedRoles: derivedRoles,
        videoUrl: item.videoUrl ?? item.video ?? item.videos?.[0]?.url,
        documentUrl: item.documentUrl ?? item.documents?.[0]?.url,
        duration: Number(
            item.duration ??
            item.durationMinutes ??
            item.estimatedDuration ??
            item.lessonCount ??
            item.totalLessonPoint ??
            0
        ),
        status: mapBackendStatusToCourseStatus(item.status, item.isActive),
        publishedAt: item.publishedAt ?? item.updateDate ?? item.createdAt,
        createdAt: item.createdAt ?? new Date().toISOString(),
        enrolledCount: Number(
            item.enrolledCount ??
            item.totalEnrolled ??
            item.totalLessonPoint ??
            item.lessonCount ??
            item.userTrainings?.length ??
            0
        ),
        completedCount: Number(
            item.completedCount ??
            item.totalCompleted ??
            item.lessonCount ??
            0
        ),
        thumbnail: item.thumbnail ?? item.thumbnailUrl ?? item.coverImage ?? undefined,
        point: Number(item.point ?? item.basePoint ?? 0),
        lessonCount: Number(item.lessonCount ?? item.totalLessons ?? 0),
        totalLessonPoint: Number(item.totalLessonPoint ?? item.sumLessonPoint ?? item.point ?? 0),
        roleId: Number(item.roleId ?? item.role?.id ?? item.role?.roleId ?? item.trainingRoleId ?? 0) || undefined,
        roleName: item.roleName ?? item.role?.name ?? item.role?.roleName ?? undefined,
        isActive: typeof item.isActive === 'boolean' ? item.isActive : undefined,
    };
};

const detailStatsConfig = (training: TrainingCourse) => ([
    { label: 'Điểm khóa', value: training.point ?? 0 },
    { label: 'Bài học', value: training.lessonCount ?? 0 },
    { label: 'Tổng điểm bài', value: training.totalLessonPoint ?? training.point ?? 0 },
]);

export default function TrainingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; training: TrainingCourse | null; isDeleting: boolean }>({
        open: false,
        training: null,
        isDeleting: false,
    });
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [detailState, setDetailState] = useState<TrainingDetailState>({
        open: false,
        isLoading: false,
        training: null,
        error: null,
    });
    const [lessonsPagination, setLessonsPagination] = useState({
        page: 0,
        size: TRAINING_LESSON_PAGE_SIZE,
        includeDeleted: true,
    });
    const [lessonsData, setLessonsData] = useState<{
        items: TrainingLesson[];
        totalPages: number;
        totalElements: number;
    }>({
        items: [],
        totalPages: 0,
        totalElements: 0,
    });
    const [lessonsLoading, setLessonsLoading] = useState(false);
    const [lessonsError, setLessonsError] = useState<string | null>(null);
    const [lessonsRefreshKey, setLessonsRefreshKey] = useState(0);
    const [lessonPanelView, setLessonPanelView] = useState<'list' | 'detail'>('list');
    const [lessonCreateDialogOpen, setLessonCreateDialogOpen] = useState(false);
    const [lessonEditMode, setLessonEditMode] = useState<{ open: boolean; lesson: TrainingLesson | null }>({
        open: false,
        lesson: null,
    });
    const [lessonForm, setLessonForm] = useState<{
        title: string;
        description: string;
        content: string;
        point: string;
        orderIndex: string;
        isActive: boolean;
    }>({
        title: '',
        description: '',
        content: '',
        point: '',
        orderIndex: '',
        isActive: true,
    });
    const [lessonFormErrors, setLessonFormErrors] = useState<Record<string, string>>({});
    const [lessonFormLoading, setLessonFormLoading] = useState(false);
    const [lessonDetailState, setLessonDetailState] = useState<{
        open: boolean;
        isLoading: boolean;
        lesson: TrainingLesson | null;
        error: string | null;
    }>({
        open: false,
        isLoading: false,
        lesson: null,
        error: null,
    });
    const [lessonDocuments, setLessonDocuments] = useState<LessonDocument[]>([]);
    const [lessonDocumentsLoading, setLessonDocumentsLoading] = useState(false);
    const [lessonDocumentsError, setLessonDocumentsError] = useState<string | null>(null);
    const [documentFormOpen, setDocumentFormOpen] = useState(false);
    const [documentForm, setDocumentForm] = useState<{
        name: string;
        refLink: string;
        description: string;
    }>({
        name: '',
        refLink: '',
        description: '',
    });
    const [documentFormErrors, setDocumentFormErrors] = useState<Record<string, string>>({});
    const [documentFormLoading, setDocumentFormLoading] = useState(false);
    const [documentEditMode, setDocumentEditMode] = useState<{ open: boolean; document: LessonDocument | null }>({
        open: false,
        document: null,
    });
    const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<LessonDocument | null>(null);

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
        queryKey: ['admin-trainings', debouncedSearch],
        queryFn: async () => {
            const payload: GetTrainningsData = {
                includeInactive: true,
                page: 0,
                size: TRAINING_PAGE_SIZE,
                sortBy: 'createdAt',
                sortDirection: 'ASC',
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
        if (shouldRefetch) {
            refetch();
            setShouldRefetch(false);
        }
    }, [shouldRefetch, refetch]);

    useEffect(() => {
        if (trainingsError) {
            const message =
                trainingsError instanceof Error
                    ? trainingsError.message
                    : 'Không thể tải danh sách khóa đào tạo';
            console.error('Tải khóa đào tạo thất bại:', message);
        }
    }, [trainingsError]);

    useEffect(() => {
        if (!detailState.open || !detailState.training) {
            return;
        }

        let ignore = false;

        const fetchLessons = async () => {
            try {
                setLessonsLoading(true);
                setLessonsError(null);

                const response = await getTrainingLessons(detailState.training!.id, {
                    includeDeleted: lessonsPagination.includeDeleted,
                    page: lessonsPagination.page,
                    size: lessonsPagination.size,
                    sortBy: 'id',
                    sortDirection: 'ASC',
                });

                if (ignore) return;

                const data = response?.data;
                setLessonsData({
                    items: data?.content ?? [],
                    totalPages: data?.totalPages ?? 0,
                    totalElements: data?.totalElements ?? 0,
                });
            } catch (error) {
                if (ignore) return;
                const serverDesc =
                    (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                    (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                    (error instanceof Error ? error.message : 'Không thể tải danh sách bài học');
                setLessonsError(serverDesc);
            } finally {
                if (!ignore) {
                    setLessonsLoading(false);
                }
            }
        };

        fetchLessons();

        return () => {
            ignore = true;
        };
    }, [
        detailState.open,
        detailState.training,
        lessonsPagination.includeDeleted,
        lessonsPagination.page,
        lessonsPagination.size,
        lessonsRefreshKey,
    ]);

    const courses = useMemo(
        () => extractTrainingList(trainingResponse).map(mapTrainingCourse),
        [trainingResponse]
    );

    const statusCounts = useMemo(
        () => ({
            all: courses.length,
            PUBLISHED: courses.filter((course) => course.status === 'PUBLISHED').length,
            DRAFT: courses.filter((course) => course.status === 'DRAFT').length,
            ARCHIVED: courses.filter((course) => course.status === 'ARCHIVED').length,
        }),
        [courses]
    );

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return courses.filter((course) => {
            const matchesStatus = selectedStatus === 'all' ? true : course.status === selectedStatus;
            const matchesSearch = query
                ? course.name.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query) ||
                (course.recipeName?.toLowerCase().includes(query) ?? false)
                : true;
            return matchesStatus && matchesSearch;
        });
    }, [courses, selectedStatus, searchQuery]);

    const totalCourses = statusCounts.all;
    const activeCourses = courses.filter((course) => course.status === 'PUBLISHED' || course.isActive).length;
    const totalLessons = courses.reduce((sum, c) => sum + (c.lessonCount ?? 0), 0);
    const totalLessonPoints = courses.reduce(
        (sum, c) => sum + (c.totalLessonPoint ?? c.point ?? 0),
        0
    );

    const statuses = [
        { value: 'all', label: 'Tất cả', count: statusCounts.all },
        { value: 'PUBLISHED', label: 'Đã xuất bản', count: statusCounts.PUBLISHED },
        {
            value: 'DRAFT',
            label: 'Nháp',
            count: statusCounts.DRAFT,
        },
        {
            value: 'ARCHIVED',
            label: 'Lưu trữ',
            count: statusCounts.ARCHIVED,
        },
    ];


    const getRoleColor = (role: StaffRole) => {
        const colors: Record<StaffRole, string> = {
            CHEF: 'from-orange-500 to-red-500',
            BRANCH_MANAGER: 'from-blue-500 to-cyan-500',
            STAFF: 'from-green-500 to-emerald-500',
            WAITER: 'from-green-500 to-teal-500',
            SHIPPER: 'from-purple-500 to-pink-500',
            ALL: 'from-purple-500 to-indigo-500',
        };
        return colors[role];
    };

    const getRoleText = (role: StaffRole) => {
        const text: Record<StaffRole, string> = {
            CHEF: 'Bếp trưởng',
            BRANCH_MANAGER: 'Quản lý',
            STAFF: 'Nhân viên',
            WAITER: 'Phục vụ',
            SHIPPER: 'Giao hàng',
            ALL: 'Tất cả',
        };
        return text[role];
    };

    const detailStats = detailState.training ? detailStatsConfig(detailState.training) : [];
    const hasPrevLessonPage = lessonsPagination.page > 0;
    const hasNextLessonPage =
        lessonsData.totalPages > 0 ? lessonsPagination.page < lessonsData.totalPages - 1 : false;
    const lessonPageDisplay = lessonsData.totalElements === 0 ? 0 : lessonsPagination.page + 1;
    const lessonTotalPageDisplay =
        lessonsData.totalPages > 0 ? lessonsData.totalPages : lessonsData.totalElements > 0 ? 1 : 0;

    const closeDetailDialog = () => {
        setDetailState({
            open: false,
            isLoading: false,
            training: null,
            error: null,
        });
        resetLessonsState();
        setLessonDetailState({
            open: false,
            isLoading: false,
            lesson: null,
            error: null,
        });
        setLessonCreateDialogOpen(false);
        setLessonEditMode({ open: false, lesson: null });
    };

    const handleViewTraining = async (trainingId: number) => {
        setDetailState({
            open: true,
            isLoading: true,
            training: null,
            error: null,
        });
        setLessonsPagination((prev) => ({ ...prev, page: 0 }));
        setLessonPanelView('list');
        setLessonDetailState({
            open: false,
            isLoading: false,
            lesson: null,
            error: null,
        });

        try {
            const payload = await getTrainningById(trainingId);
            const trainingItem = extractTrainingDetail(payload);

            if (!trainingItem) {
                throw new Error('Không tìm thấy dữ liệu khóa đào tạo');
            }

            setDetailState({
                open: true,
                isLoading: false,
                training: mapTrainingCourse(trainingItem),
                error: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể tải chi tiết khóa đào tạo';
            setDetailState({
                open: true,
                isLoading: false,
                training: null,
                error: message,
            });
        }
    };

    const openDeleteDialog = (training: TrainingCourse) => {
        setDeleteDialog({
            open: true,
            training,
            isDeleting: false,
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({
            open: false,
            training: null,
            isDeleting: false,
        });
    };

    const resetLessonsState = () => {
        setLessonsPagination({
            page: 0,
            size: TRAINING_LESSON_PAGE_SIZE,
            includeDeleted: true,
        });
        setLessonsData({
            items: [],
            totalPages: 0,
            totalElements: 0,
        });
        setLessonsError(null);
        setLessonsLoading(false);
        setLessonsRefreshKey(0);
        setLessonPanelView('list');
        setLessonDetailState({
            open: false,
            isLoading: false,
            lesson: null,
            error: null,
        });
        setLessonForm({
            title: '',
            description: '',
            content: '',
            point: '',
            orderIndex: '',
            isActive: true,
        });
        setLessonFormErrors({});
        setLessonFormLoading(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog.training || deleteDialog.isDeleting) {
            return;
        }

        try {
            setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
            const payload = await deleteTraining(deleteDialog.training.id);
            const message =
                (payload && typeof payload === 'object' && 'desc' in payload && typeof payload.desc === 'string')
                    ? payload.desc
                    : 'Xoá khóa đào tạo thành công';
            console.info(message);
            setShouldRefetch(true);
            closeDeleteDialog();
        } catch (error) {
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
            const message = serverDesc || (error instanceof Error ? error.message : 'Xoá khóa đào tạo thất bại');
            console.error(message);
            setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
        }
    };

    const handleLessonsPageChange = (direction: 'prev' | 'next') => {
        setLessonsPagination((prev) => {
            const totalPages = lessonsData.totalPages;
            const nextPage = direction === 'next' ? prev.page + 1 : prev.page - 1;

            if (nextPage < 0) return prev;
            if (totalPages > 0 && nextPage >= totalPages) return prev;

            return { ...prev, page: nextPage };
        });
    };

    const toggleIncludeDeletedLessons = () => {
        setLessonsPagination((prev) => ({
            ...prev,
            includeDeleted: !prev.includeDeleted,
            page: 0,
        }));
        setLessonPanelView('list');
    };

    const triggerLessonsReload = () => {
        setLessonsRefreshKey((prev) => prev + 1);
    };

    const handleViewLessonDetail = async (lessonId: number) => {
        setLessonDetailState({
            open: true,
            isLoading: true,
            lesson: null,
            error: null,
        });
        setLessonPanelView('detail');
        setLessonDocuments([]);
        setLessonDocumentsError(null);
        setLessonDocumentsLoading(true);

        try {
            const response = await getLessonDetail(lessonId);
            setLessonDetailState({
                open: true,
                isLoading: false,
                lesson: response?.data ?? null,
                error: null,
            });

            // Fetch documents
            try {
                const documentsResponse = await getLessonDocuments(lessonId);
                setLessonDocuments(documentsResponse?.data ?? []);
            } catch (docError) {
                console.error('Failed to fetch documents:', docError);
                setLessonDocumentsError('Không thể tải danh sách tài liệu');
            } finally {
                setLessonDocumentsLoading(false);
            }
        } catch (error) {
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error instanceof Error ? error.message : 'Không thể tải chi tiết bài học');
            setLessonDetailState({
                open: true,
                isLoading: false,
                lesson: null,
                error: serverDesc,
            });
            setLessonDocumentsLoading(false);
        }
    };

    const closeLessonDetail = () => {
        setLessonDetailState({
            open: false,
            isLoading: false,
            lesson: null,
            error: null,
        });
        setLessonPanelView('list');
        setLessonDocuments([]);
        setLessonDocumentsError(null);
        setLessonDocumentsLoading(false);
        setDocumentFormOpen(false);
        setDocumentForm({ name: '', refLink: '', description: '' });
        setDocumentFormErrors({});
        setDocumentEditMode({ open: false, document: null });
        setDeletingDocumentId(null);
        setDocumentToDelete(null);
    };

    const openDocumentForm = () => {
        setDocumentForm({ name: '', refLink: '', description: '' });
        setDocumentFormErrors({});
        setDocumentEditMode({ open: false, document: null }); // Đóng edit mode nếu đang mở
        setDocumentFormOpen(true);
    };

    const openDocumentEditForm = (document: LessonDocument) => {
        setDocumentForm({
            name: document.name ?? '',
            refLink: document.refLink ?? '',
            description: document.description ?? '',
        });
        setDocumentFormErrors({});
        setDocumentFormOpen(false); // Đóng form "Thêm tài liệu" nếu đang mở
        setDocumentEditMode({ open: true, document });
    };

    const closeDocumentForm = () => {
        setDocumentFormOpen(false);
        setDocumentForm({ name: '', refLink: '', description: '' });
        setDocumentFormErrors({});
        setDocumentEditMode({ open: false, document: null });
    };

    const validateDocumentForm = () => {
        const newErrors: Record<string, string> = {};

        if (!documentForm.name.trim()) newErrors.name = 'Vui lòng nhập tên tài liệu';
        if (!documentForm.refLink.trim()) newErrors.refLink = 'Vui lòng nhập link tài liệu';
        if (!documentForm.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';

        setDocumentFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDocumentFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonDetailState.lesson) return;
        if (!validateDocumentForm()) return;

        const payload: CreateDocumentPayload = {
            name: documentForm.name.trim(),
            refLink: documentForm.refLink.trim(),
            description: documentForm.description.trim(),
            lessonId: lessonDetailState.lesson.id,
        };

        const isEditMode = documentEditMode.open && documentEditMode.document !== null;

        try {
            setDocumentFormLoading(true);
            if (isEditMode && documentEditMode.document) {
                await updateLessonDocument(documentEditMode.document.id, payload);
            } else {
                await createLessonDocument(lessonDetailState.lesson.id, payload);
            }
            closeDocumentForm();
            // Refetch documents
            if (lessonDetailState.lesson) {
                try {
                    setLessonDocumentsLoading(true);
                    const documentsResponse = await getLessonDocuments(lessonDetailState.lesson.id);
                    setLessonDocuments(documentsResponse?.data ?? []);
                } catch (docError) {
                    console.error('Failed to refetch documents:', docError);
                    setLessonDocumentsError('Không thể tải lại danh sách tài liệu');
                } finally {
                    setLessonDocumentsLoading(false);
                }
            }
        } catch (error) {
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error instanceof Error ? error.message : (isEditMode ? 'Không thể cập nhật tài liệu' : 'Không thể tạo tài liệu'));
            setDocumentFormErrors({ form: serverDesc });
        } finally {
            setDocumentFormLoading(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!documentToDelete || !lessonDetailState.lesson) return;

        try {
            setDeletingDocumentId(documentToDelete.id);
            await deleteLessonDocument(documentToDelete.id);
            setDocumentToDelete(null);

            // Refetch documents
            try {
                setLessonDocumentsLoading(true);
                const documentsResponse = await getLessonDocuments(lessonDetailState.lesson.id);
                setLessonDocuments(documentsResponse?.data ?? []);
            } catch (docError) {
                console.error('Failed to refetch documents:', docError);
                setLessonDocumentsError('Không thể tải lại danh sách tài liệu');
            } finally {
                setLessonDocumentsLoading(false);
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error instanceof Error ? error.message : 'Không thể xóa tài liệu');
            alert(serverDesc);
        } finally {
            setDeletingDocumentId(null);
        }
    };

    const openLessonCreateForm = () => {
        if (!detailState.training) return;
        setLessonForm({
            title: '',
            description: '',
            content: '',
            point: '',
            orderIndex: String(lessonsData.totalElements + 1 || 1),
            isActive: true,
        });
        setLessonFormErrors({});
        setLessonCreateDialogOpen(true);
    };

    const closeLessonCreateDialog = () => {
        setLessonCreateDialogOpen(false);
        setLessonForm({
            title: '',
            description: '',
            content: '',
            point: '',
            orderIndex: '',
            isActive: true,
        });
        setLessonFormErrors({});
    };

    const openLessonEditForm = (lesson: TrainingLesson) => {
        if (!detailState.training) return;
        setLessonForm({
            title: lesson.title ?? '',
            description: lesson.description ?? '',
            content: lesson.content ?? '',
            point: lesson.point !== undefined ? String(lesson.point) : '',
            orderIndex: lesson.orderIndex !== undefined ? String(lesson.orderIndex) : '',
            isActive: lesson.isActive ?? true,
        });
        setLessonFormErrors({});
        setLessonEditMode({ open: true, lesson });
    };

    const closeLessonEditDialog = () => {
        setLessonEditMode({ open: false, lesson: null });
        setLessonForm({
            title: '',
            description: '',
            content: '',
            point: '',
            orderIndex: '',
            isActive: true,
        });
        setLessonFormErrors({});
    };

    const validateLessonForm = () => {
        const newErrors: Record<string, string> = {};

        if (!lessonForm.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề bài học';
        if (!lessonForm.description.trim()) newErrors.description = 'Vui lòng nhập mô tả ngắn';
        if (!lessonForm.content.trim()) newErrors.content = 'Vui lòng nhập nội dung bài học';
        if (!lessonForm.point.trim()) {
            newErrors.point = 'Vui lòng nhập điểm bài học';
        } else if (Number.isNaN(Number(lessonForm.point)) || Number(lessonForm.point) <= 0) {
            newErrors.point = 'Điểm phải là số nguyên dương';
        }
        if (!lessonForm.orderIndex.trim()) {
            newErrors.orderIndex = 'Vui lòng nhập thứ tự bài học';
        } else if (Number.isNaN(Number(lessonForm.orderIndex)) || Number(lessonForm.orderIndex) <= 0) {
            newErrors.orderIndex = 'Thứ tự phải là số nguyên dương';
        }

        setLessonFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLessonFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!detailState.training) return;
        if (!validateLessonForm()) return;

        const payload: CreateLessonPayload = {
            title: lessonForm.title.trim(),
            description: lessonForm.description.trim(),
            content: lessonForm.content.trim(),
            point: Number(lessonForm.point),
            orderIndex: Number(lessonForm.orderIndex),
            trainingId: detailState.training.id,
            isActive: lessonForm.isActive,
        };

        const isEditMode = lessonEditMode.open && lessonEditMode.lesson !== null;

        try {
            setLessonFormLoading(true);
            if (isEditMode && lessonEditMode.lesson) {
                await updateLesson(lessonEditMode.lesson.id, payload);
                closeLessonEditDialog();
            } else {
                await createLesson(detailState.training.id, payload);
                closeLessonCreateDialog();
            }
            triggerLessonsReload();
            if (lessonPanelView === 'detail' && isEditMode) {
                setLessonPanelView('list');
            }
        } catch (error) {
            const serverDesc =
                (error as { response?: { data?: { desc?: string; error?: string } } })?.response?.data?.desc ||
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error instanceof Error ? error.message : (isEditMode ? 'Không thể cập nhật bài học' : 'Không thể tạo bài học mới'));
            setLessonFormErrors({ form: serverDesc });
        } finally {
            setLessonFormLoading(false);
        }
    };


    return (
        <AdminGuard>
            <AdminPageLayout>
                {/* Header */}
                <AdminPageHeader
                    title="Quản Lý Khóa Đào Tạo"
                    description="Tạo và quản lý khóa học cho nhân viên"
                    icon={GraduationCap}
                    actions={<AddTrainingDialog onSuccess={() => setShouldRefetch(true)} />}
                />

                {/* Stats Cards */}
                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng khóa học"
                        value={totalCourses}
                        icon={GraduationCap}
                        iconClassName="from-blue-500 to-cyan-500"
                    />
                    <AdminStatsCard
                        title="Đang hoạt động"
                        value={activeCourses}
                        icon={CheckCircle}
                        className="border-green-200"
                        iconClassName="from-green-500 to-emerald-500"
                    />
                    <AdminStatsCard
                        title="Số bài học"
                        value={totalLessons}
                        icon={BookOpen}
                        className="border-purple-200"
                        iconClassName="from-purple-500 to-indigo-500"
                    />
                    <AdminStatsCard
                        title="Tổng điểm"
                        value={totalLessonPoints}
                        icon={Users}
                        className="border-orange-200"
                        iconClassName="from-orange-500 to-red-500"
                    />
                </AdminStatsGrid>

                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                            strokeWidth={2.5}
                        />
                        <Input
                            placeholder="Tìm kiếm khóa học..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 py-6 border-2 border-gray-200 rounded-xl focus:border-primary text-base"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 items-center">
                        {statuses.map((status) => (
                            <Button
                                key={status.value}
                                onClick={() => setSelectedStatus(status.value)}
                                variant={selectedStatus === status.value ? 'default' : 'outline'}
                                className={`rounded-xl font-semibold whitespace-nowrap transition-all ${selectedStatus === status.value
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                    : 'border-2 border-gray-200 text-gray-600 hover:border-primary'
                                    }`}
                            >
                                {status.label}
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20">
                                    {status.count}
                                </span>
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="rounded-xl border-gray-200 text-gray-600 hover:text-primary"
                        >
                            <RefreshCw
                                size={16}
                                className={`mr-2 ${isFetchingTrainings ? 'animate-spin' : ''}`}
                                strokeWidth={2.5}
                            />
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {isLoadingTrainings && courses.length === 0 && (
                        <Card className="col-span-full flex items-center justify-center py-16">
                            <div className="flex items-center gap-3 text-gray-500">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                                <span>Đang tải danh sách khóa đào tạo...</span>
                            </div>
                        </Card>
                    )}

                    {!isLoadingTrainings && filteredCourses.length === 0 && (
                        <Card className="col-span-full flex flex-col items-center justify-center py-16 text-center space-y-3 border-dashed border-2 border-gray-200">
                            <GraduationCap size={36} className="text-gray-400" />
                            <div>
                                <p className="font-semibold text-gray-700">Chưa có khóa đào tạo nào phù hợp</p>
                                <p className="text-sm text-gray-500">Thử điều chỉnh bộ lọc hoặc tạo khóa đào tạo mới.</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => refetch()}>
                                    <RefreshCw
                                        size={16}
                                        className={`mr-2 ${isFetchingTrainings ? 'animate-spin' : ''}`}
                                        strokeWidth={2.5}
                                    />
                                    Tải lại
                                </Button>
                                <AddTrainingDialog />
                            </div>
                        </Card>
                    )}

                    {filteredCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group"
                        >
                            <div className="flex gap-6 p-6">
                                {/* Thumbnail */}
                                <div className="relative w-48 h-48 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                                    {course.thumbnail ? (
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <GraduationCap size={48} className="text-gray-400" strokeWidth={1.5} />
                                        </div>
                                    )}

                                    {/* {course.status === 'PUBLISHED' && (
                                                <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-xs font-bold shadow-lg">
                                                    Live
                                                </div>
                                    )} */}

                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {course.name}

                                            </h3>

                                            {/* {course.roleName && (
                                                        <p className="text-sm text-primary font-semibold mb-1 flex items-center gap-1">
                                                    <Users size={14} strokeWidth={2.5} />
                                                    Vai trò: {course.roleName}
                                                        </p>
                                            )} */}

                                            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {course.roleName ? (
                                            <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md">
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

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border border-blue-100">
                                            <BookOpen size={16} className="text-blue-500 mx-auto mb-1" strokeWidth={2.5} />
                                            <p className="text-xs text-gray-500 font-semibold">
                                                {course.lessonCount ?? 0} bài
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border border-purple-100">
                                            <GraduationCap size={16} className="text-purple-500 mx-auto mb-1" strokeWidth={2.5} />
                                            <p className="text-xs text-gray-500 font-semibold">
                                                Điểm khóa: {course.point ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-transparent rounded-xl border border-green-100">
                                            <CheckCircle
                                                size={16}
                                                className="text-green-500 mx-auto mb-1"
                                                strokeWidth={2.5}
                                            />
                                            <p className="text-xs text-gray-500 font-semibold">
                                                Tổng điểm: {course.totalLessonPoint ?? course.point ?? 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-auto pt-4 border-t-2 border-gray-100">
                                        <AddTrainingDialog
                                            mode="edit"
                                            training={course}
                                            onSuccess={() => setShouldRefetch(true)}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-2 border-primary text-primary hover:bg-primary font-semibold rounded-xl transition-all"
                                                >
                                                    <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                                    Sửa
                                                </Button>
                                            }
                                        />
                                        {course.status === 'DRAFT' && (
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <Send size={16} className="mr-1" strokeWidth={2.5} />
                                                Xuất bản
                                            </Button>
                                        )}
                                        {course.status === 'PUBLISHED' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold rounded-xl transition-all"
                                                onClick={() => handleViewTraining(course.id)}
                                            >
                                                <Eye size={16} className="mr-1" strokeWidth={2.5} />
                                                Xem
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDeleteDialog(course)}
                                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Dialog open={detailState.open} onOpenChange={(open: boolean) => (open ? null : closeDetailDialog())}>
                    <DialogContent className="w-[97vw] max-w-[97vw] sm:!max-w-[92vw] lg:!max-w-[75vw] xl:!max-w-[65vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Chi tiết khóa đào tạo</DialogTitle>
                            <DialogDescription>
                                Thông tin mô tả, phân quyền và thống kê của khóa đào tạo
                            </DialogDescription>
                        </DialogHeader>

                        {detailState.isLoading && (
                            <div className="flex items-center justify-center py-10 text-gray-500">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-3" />
                                Đang tải dữ liệu...
                            </div>
                        )}

                        {!detailState.isLoading && detailState.error && (
                            <div className="py-6 text-center text-red-500 font-semibold">
                                {detailState.error}
                            </div>
                        )}

                        {!detailState.isLoading && !detailState.error && detailState.training && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {detailState.training.name}
                                        </h2>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${detailState.training.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {detailState.training.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                        </span>
                                    </div>

                                    {/* {detailState.training.roleName && (
                                        <p className="text-sm text-primary font-semibold">
                                            Vai trò chính: {detailState.training.roleName}
                                        </p>
                                    )} */}

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {detailState.training.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {detailStats.map((stat) => (
                                        <Card key={stat.label} className="p-4 border border-gray-100 shadow-none">
                                            <p className="text-xs uppercase text-gray-500 font-semibold">
                                                {stat.label}
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </Card>
                                    ))}
                                </div>

                                <div className='flex align-center gap-2 '>
                                    <p className="text-xs uppercase text-gray-500 font-semibold">
                                        Vai trò được gán:
                                    </p>
                                    <p className="text-xs uppercase text-primary font-semibold">
                                        {detailState.training.roleName}
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-4 ">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Bài học của khóa</p>
                                            <p className="text-xs text-gray-500">
                                                Tổng cộng {lessonsData.totalElements} bài học
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={openLessonCreateForm}
                                                disabled={!detailState.training}
                                                className="bg-primary text-white shadow-sm hover:shadow-md"
                                            >
                                                <Plus size={14} className="mr-1" />
                                                Thêm bài học
                                            </Button>
                                            <button
                                                type="button"
                                                onClick={toggleIncludeDeletedLessons}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${lessonsPagination.includeDeleted
                                                    ? 'border-orange-300 text-orange-600 bg-orange-50'
                                                    : 'border-gray-200 text-gray-500 bg-white'
                                                    }`}
                                            >
                                                {lessonsPagination.includeDeleted ? 'Hiện bài đang ẩn' : 'Hiển thị bài đang hoạt động'}
                                            </button>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <button
                                                    type="button"
                                                    onClick={() => handleLessonsPageChange('prev')}
                                                    disabled={!hasPrevLessonPage || lessonsLoading}
                                                    className="px-2 py-1 border rounded-md disabled:opacity-40"
                                                >
                                                    Trước
                                                </button>
                                                <span>
                                                    Trang {lessonPageDisplay}/{lessonTotalPageDisplay}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleLessonsPageChange('next')}
                                                    disabled={!hasNextLessonPage || lessonsLoading}
                                                    className="px-2 py-1 border rounded-md disabled:opacity-40"
                                                >
                                                    Sau
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {lessonPanelView === 'list' ? (
                                        lessonsLoading ? (
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                                                Đang tải danh sách bài học...
                                            </div>
                                        ) : lessonsError ? (
                                            <p className="text-sm text-red-500">{lessonsError}</p>
                                        ) : lessonsData.items.length === 0 ? (
                                            <p className="text-sm text-gray-500">Chưa có bài học nào cho khóa này.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {lessonsData.items.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className=" mt-5 p-4 border border-gray-200 rounded-xl space-y-3 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                                                        onClick={() => handleViewLessonDetail(lesson.id)}
                                                    >
                                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{lesson.title}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Thứ tự #{lesson.orderIndex} ·{' '}
                                                                    {lesson.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                                                </p>
                                                            </div>
                                                            <span className="text-sm font-semibold text-primary">
                                                                +{lesson.point} điểm
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {lesson.description}
                                                        </p>
                                                        <div className="flex justify-end">

                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewLessonDetail(lesson.id);
                                                                }}
                                                                className="text-primary border-primary hover:bg-primary transition-colors"
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ) : lessonPanelView === 'detail' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={closeLessonDetail}
                                                    className="flex items-center mb-3 mt-5 bg-primary text-white text-sm font-semibold hover:bg-primary/80 px-4 py-2 rounded-md transition-colors"
                                                >
                                                    <ArrowLeft size={20} className="mr-1" />
                                                    Quay lại
                                                </button>
                                                {lessonDetailState.lesson && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (lessonDetailState.lesson) {
                                                                openLessonEditForm(lessonDetailState.lesson);
                                                            }
                                                        }}
                                                        className="border-2 border-primary text-primary bg-primary hover:bg-primary font-semibold rounded-xl transition-all"
                                                    >
                                                        <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                                        Sửa
                                                    </Button>
                                                )}
                                            </div>

                                            {lessonDetailState.isLoading ? (
                                                <div className="flex items-center gap-2 text-gray-500 text-sm py-6">
                                                    <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                                                    Đang tải bài học...
                                                </div>
                                            ) : lessonDetailState.error ? (
                                                <p className="text-sm text-red-500 py-4">{lessonDetailState.error}</p>
                                            ) : lessonDetailState.lesson ? (
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-xl font-bold text-gray-900">{lessonDetailState.lesson.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Thứ tự #{lessonDetailState.lesson.orderIndex} ·{' '}
                                                            {lessonDetailState.lesson.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {[
                                                            { label: 'Điểm bài học', value: lessonDetailState.lesson.point },
                                                            { label: 'Thuộc khóa', value: lessonDetailState.lesson.trainingId },
                                                            { label: 'ID', value: lessonDetailState.lesson.id },
                                                        ].map((stat) => (
                                                            <Card key={stat.label} className="p-4 border border-gray-100 shadow-none">
                                                                <p className="text-xs uppercase text-gray-500 font-semibold">{stat.label}</p>
                                                                <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                                                            </Card>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm font-semibold text-gray-700">Mô tả</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {lessonDetailState.lesson.description}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm font-semibold text-gray-700">Nội dung</p>
                                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                            {lessonDetailState.lesson.content}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 border-t border-gray-200 pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FileText size={18} className="text-primary" />
                                                                <p className="text-sm font-semibold text-gray-700">Tài liệu đính kèm</p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={openDocumentForm}
                                                                disabled={lessonDocumentsLoading || documentFormOpen}
                                                                className="bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {lessonDocumentsLoading ? (
                                                                    <>
                                                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                                                        Đang tải...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Plus size={14} className="mr-1" />
                                                                        Thêm tài liệu
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {lessonDocumentsLoading ? (
                                                            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
                                                                <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                                                                Đang tải tài liệu...
                                                            </div>
                                                        ) : lessonDocumentsError ? (
                                                            <p className="text-sm text-red-500 py-2">{lessonDocumentsError}</p>
                                                        ) : lessonDocuments.length === 0 && !documentFormOpen ? (
                                                            <p className="text-sm text-gray-500 py-2">Chưa có tài liệu nào cho bài học này.</p>
                                                        ) : (
                                                            <>
                                                                {lessonDocuments.length > 0 && (
                                                                    <div className="space-y-3">
                                                                        {lessonDocuments.map((doc) => {
                                                                            const isEditingThisDoc = documentEditMode.open && documentEditMode.document?.id === doc.id;
                                                                            return (
                                                                                <Card key={doc.id} className={`p-4 border transition-colors bg-white ${isEditingThisDoc ? 'border-2 border-primary' : 'border-gray-200 hover:border-primary'}`}>
                                                                                    {isEditingThisDoc ? (
                                                                                        <>
                                                                                            <div className="mb-3 flex items-center gap-2">
                                                                                                <FileText size={18} className="text-primary" />
                                                                                                <p className="text-sm font-semibold text-gray-700">Cập nhật tài liệu</p>
                                                                                            </div>
                                                                                            {documentFormErrors.form && (
                                                                                                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                                                                                    {documentFormErrors.form}
                                                                                                </div>
                                                                                            )}
                                                                                            <form onSubmit={handleDocumentFormSubmit} className="space-y-3">
                                                                                                <div className="space-y-1">
                                                                                                    <label className="text-xs font-semibold text-gray-700">
                                                                                                        Tên tài liệu <span className="text-red-500">*</span>
                                                                                                    </label>
                                                                                                    <Input
                                                                                                        placeholder="Nhập tên tài liệu"
                                                                                                        value={documentForm.name}
                                                                                                        onChange={(e) =>
                                                                                                            setDocumentForm((prev) => ({ ...prev, name: e.target.value }))
                                                                                                        }
                                                                                                        className={`h-9 text-sm border-2 ${documentFormErrors.name ? 'border-red-400' : 'border-gray-200'} focus:border-primary`}
                                                                                                    />
                                                                                                    {documentFormErrors.name && (
                                                                                                        <p className="text-xs text-red-500">{documentFormErrors.name}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="space-y-1">
                                                                                                    <label className="text-xs font-semibold text-gray-700">
                                                                                                        Link tài liệu <span className="text-red-500">*</span>
                                                                                                    </label>
                                                                                                    <Input
                                                                                                        placeholder="https://..."
                                                                                                        value={documentForm.refLink}
                                                                                                        onChange={(e) =>
                                                                                                            setDocumentForm((prev) => ({ ...prev, refLink: e.target.value }))
                                                                                                        }
                                                                                                        className={`h-9 text-sm border-2 ${documentFormErrors.refLink ? 'border-red-400' : 'border-gray-200'} focus:border-primary`}
                                                                                                    />
                                                                                                    {documentFormErrors.refLink && (
                                                                                                        <p className="text-xs text-red-500">{documentFormErrors.refLink}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="space-y-1">
                                                                                                    <label className="text-xs font-semibold text-gray-700">
                                                                                                        Mô tả <span className="text-red-500">*</span>
                                                                                                    </label>
                                                                                                    <textarea
                                                                                                        rows={2}
                                                                                                        placeholder="Nhập mô tả tài liệu"
                                                                                                        value={documentForm.description}
                                                                                                        onChange={(e) =>
                                                                                                            setDocumentForm((prev) => ({ ...prev, description: e.target.value }))
                                                                                                        }
                                                                                                        className={`w-full text-sm rounded-md border-2 px-3 py-2 ${documentFormErrors.description ? 'border-red-400' : 'border-gray-200'} focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none`}
                                                                                                    />
                                                                                                    {documentFormErrors.description && (
                                                                                                        <p className="text-xs text-red-500">{documentFormErrors.description}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex gap-2 pt-2">
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        variant="outline"
                                                                                                        size="sm"
                                                                                                        onClick={closeDocumentForm}
                                                                                                        className="flex-1 h-9 text-sm"
                                                                                                        disabled={documentFormLoading}
                                                                                                    >
                                                                                                        Hủy
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        type="submit"
                                                                                                        size="sm"
                                                                                                        className="flex-1 h-9 text-sm bg-primary text-white hover:bg-primary/80"
                                                                                                        disabled={documentFormLoading}
                                                                                                    >
                                                                                                        {documentFormLoading ? (
                                                                                                            <>
                                                                                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                                                                                                Đang lưu...
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <Edit size={14} className="mr-1" />
                                                                                                                Cập nhật tài liệu
                                                                                                            </>
                                                                                                        )}
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </form>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="flex flex-col gap-3">
                                                                                            <div className="flex items-start justify-between gap-3">
                                                                                                <div className="flex-1">
                                                                                                    <p className="font-semibold text-gray-900">{doc.name}</p>
                                                                                                    {doc.description && (
                                                                                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{doc.description}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        size="sm"
                                                                                                        variant="outline"
                                                                                                        onClick={() => openDocumentEditForm(doc)}
                                                                                                        disabled={documentFormOpen || deletingDocumentId === doc.id || (documentEditMode.open && documentEditMode.document?.id !== doc.id)}
                                                                                                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                                                                                                    >
                                                                                                        {deletingDocumentId === doc.id ? (
                                                                                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <Edit size={14} className="mr-1" strokeWidth={2.5} />
                                                                                                                Sửa
                                                                                                            </>
                                                                                                        )}
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        size="sm"
                                                                                                        variant="outline"
                                                                                                        onClick={() => setDocumentToDelete(doc)}
                                                                                                        disabled={documentFormOpen || deletingDocumentId === doc.id || (documentEditMode.open && documentEditMode.document?.id !== doc.id)}
                                                                                                        className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                                                                                                    >
                                                                                                        {deletingDocumentId === doc.id ? (
                                                                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <Trash2 size={14} className="mr-1" strokeWidth={2.5} />
                                                                                                                Xóa
                                                                                                            </>
                                                                                                        )}
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-3">
                                                                                                {doc.refLink && (
                                                                                                    <a
                                                                                                        href={doc.refLink}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="text-sm text-primary hover:text-orange-600 font-semibold underline-offset-4 hover:underline inline-flex items-center gap-1"
                                                                                                    >
                                                                                                        Xem tài liệu
                                                                                                        <ExternalLink size={16} strokeWidth={2.5} />
                                                                                                    </a>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </Card>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                                {documentFormOpen && !documentEditMode.open && (
                                                                    <Card className="p-4 border-2 border-primary bg-white">
                                                                        <div className="mb-3 flex items-center gap-2">
                                                                            <FileText size={18} className="text-primary" />
                                                                            <p className="text-sm font-semibold text-gray-700">
                                                                                Thêm tài liệu mới
                                                                            </p>
                                                                        </div>
                                                                        {documentFormErrors.form && (
                                                                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                                                                {documentFormErrors.form}
                                                                            </div>
                                                                        )}
                                                                        <form onSubmit={handleDocumentFormSubmit} className="space-y-3">
                                                                            <div className="space-y-1">
                                                                                <label className="text-xs font-semibold text-gray-700">
                                                                                    Tên tài liệu <span className="text-red-500">*</span>
                                                                                </label>
                                                                                <Input
                                                                                    placeholder="Nhập tên tài liệu"
                                                                                    value={documentForm.name}
                                                                                    onChange={(e) =>
                                                                                        setDocumentForm((prev) => ({ ...prev, name: e.target.value }))
                                                                                    }
                                                                                    className={`h-9 text-sm border-2 ${documentFormErrors.name ? 'border-red-400' : 'border-gray-200'} focus:border-primary`}
                                                                                />
                                                                                {documentFormErrors.name && (
                                                                                    <p className="text-xs text-red-500">{documentFormErrors.name}</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <label className="text-xs font-semibold text-gray-700">
                                                                                    Link tài liệu <span className="text-red-500">*</span>
                                                                                </label>
                                                                                <Input
                                                                                    placeholder="https://..."
                                                                                    value={documentForm.refLink}
                                                                                    onChange={(e) =>
                                                                                        setDocumentForm((prev) => ({ ...prev, refLink: e.target.value }))
                                                                                    }
                                                                                    className={`h-9 text-sm border-2 ${documentFormErrors.refLink ? 'border-red-400' : 'border-gray-200'} focus:border-primary`}
                                                                                />
                                                                                {documentFormErrors.refLink && (
                                                                                    <p className="text-xs text-red-500">{documentFormErrors.refLink}</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <label className="text-xs font-semibold text-gray-700">
                                                                                    Mô tả <span className="text-red-500">*</span>
                                                                                </label>
                                                                                <textarea
                                                                                    rows={2}
                                                                                    placeholder="Nhập mô tả tài liệu"
                                                                                    value={documentForm.description}
                                                                                    onChange={(e) =>
                                                                                        setDocumentForm((prev) => ({ ...prev, description: e.target.value }))
                                                                                    }
                                                                                    className={`w-full text-sm rounded-md border-2 px-3 py-2 ${documentFormErrors.description ? 'border-red-400' : 'border-gray-200'} focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none`}
                                                                                />
                                                                                {documentFormErrors.description && (
                                                                                    <p className="text-xs text-red-500">{documentFormErrors.description}</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex gap-2 pt-2">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={closeDocumentForm}
                                                                                    className="flex-1 h-9 text-sm"
                                                                                    disabled={documentFormLoading}
                                                                                >
                                                                                    Hủy
                                                                                </Button>
                                                                                <Button
                                                                                    type="submit"
                                                                                    size="sm"
                                                                                    className="flex-1 h-9 text-sm bg-primary text-white hover:bg-primary/80"
                                                                                    disabled={documentFormLoading}
                                                                                >
                                                                                    {documentFormLoading ? (
                                                                                        <>
                                                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                                                                            Đang lưu...
                                                                                        </>
                                                                                    ) : documentEditMode.open ? (
                                                                                        <>
                                                                                            <Edit size={14} className="mr-1" />
                                                                                            Cập nhật tài liệu
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Plus size={14} className="mr-1" />
                                                                                            Tạo tài liệu
                                                                                        </>
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    </Card>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog open={deleteDialog.open} onOpenChange={(open: boolean) => (open ? null : closeDeleteDialog())}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Xoá khóa đào tạo</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn xoá khóa{' '}
                                <span className="font-semibold text-primary">
                                    {deleteDialog.training?.name ?? ''}
                                </span>
                                ? Hành động này không thể hoàn tác.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={closeDeleteDialog}
                                disabled={deleteDialog.isDeleting}
                            >
                                Huỷ
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                disabled={deleteDialog.isDeleting}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                {deleteDialog.isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Xoá ngay'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!documentToDelete} onOpenChange={(open: boolean) => {
                    if (!open) {
                        setDocumentToDelete(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Xoá tài liệu</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn xoá tài liệu{' '}
                                <span className="font-semibold text-primary">
                                    {documentToDelete?.name ?? ''}
                                </span>
                                ? Hành động này không thể hoàn tác.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setDocumentToDelete(null)}
                                disabled={deletingDocumentId === documentToDelete?.id}
                            >
                                Huỷ
                            </Button>
                            <Button
                                onClick={handleDeleteDocument}
                                disabled={deletingDocumentId === documentToDelete?.id}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                {deletingDocumentId === documentToDelete?.id ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Đang xóa...
                                    </>
                                ) : (
                                    'Xoá ngay'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={lessonCreateDialogOpen || lessonEditMode.open} onOpenChange={(open: boolean) => {
                    if (!open) {
                        if (lessonEditMode.open) {
                            closeLessonEditDialog();
                        } else {
                            closeLessonCreateDialog();
                        }
                    }
                }}>
                    <DialogContent className="w-[96vw] max-w-[96vw] sm:!max-w-[90vw] lg:!max-w-[55vw] xl:!max-w-[40vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                <BookOpen size={28} className="text-orange-500" />
                                {lessonEditMode.open ? 'Cập nhật bài học' : 'Thêm bài học mới'}
                            </DialogTitle>
                            <DialogDescription>
                                {lessonEditMode.open ? (
                                    <>Cập nhật thông tin bài học cho khóa đào tạo: <span className="font-semibold text-primary">{detailState.training?.name}</span></>
                                ) : (
                                    <>Tạo bài học mới cho khóa đào tạo: <span className="font-semibold text-primary">{detailState.training?.name}</span></>
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        {lessonFormErrors.form && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-semibold">{lessonFormErrors.form}</p>
                            </div>
                        )}

                        <form onSubmit={handleLessonFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Tên bài học"
                                        value={lessonForm.title}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, title: e.target.value }))
                                        }
                                        className={`h-11 border-2 ${lessonFormErrors.title ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                                    />
                                    {lessonFormErrors.title && (
                                        <p className="text-xs text-red-500">{lessonFormErrors.title}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Điểm bài học <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={lessonForm.point}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, point: e.target.value }))
                                        }
                                        className={`h-11 border-2 ${lessonFormErrors.point ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                                    />
                                    {lessonFormErrors.point && (
                                        <p className="text-xs text-red-500">{lessonFormErrors.point}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Thứ tự <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={lessonForm.orderIndex}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, orderIndex: e.target.value }))
                                        }
                                        className={`h-11 border-2 ${lessonFormErrors.orderIndex ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                                    />
                                    {lessonFormErrors.orderIndex && (
                                        <p className="text-xs text-red-500">{lessonFormErrors.orderIndex}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            aria-label={lessonForm.isActive ? 'Ẩn bài học' : 'Kích hoạt bài học'}
                                            type="button"
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lessonForm.isActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                                            onClick={() =>
                                                setLessonForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                                            }
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${lessonForm.isActive ? 'translate-x-5' : 'translate-x-1'}`}
                                            />
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            {lessonForm.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Mô tả ngắn <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Mô tả ngắn gọn nội dung bài học"
                                    className={`w-full rounded-md border-2 px-3 py-2 text-sm ${lessonFormErrors.description ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all outline-none`}
                                    value={lessonForm.description}
                                    onChange={(e) =>
                                        setLessonForm((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                />
                                {lessonFormErrors.description && (
                                    <p className="text-xs text-red-500">{lessonFormErrors.description}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nội dung chi tiết <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={6}
                                    placeholder="Nhập nội dung chi tiết của bài học..."
                                    className={`w-full rounded-md border-2 px-3 py-2 text-sm ${lessonFormErrors.content ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all outline-none`}
                                    value={lessonForm.content}
                                    onChange={(e) =>
                                        setLessonForm((prev) => ({ ...prev, content: e.target.value }))
                                    }
                                />
                                {lessonFormErrors.content && (
                                    <p className="text-xs text-red-500">{lessonFormErrors.content}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (lessonEditMode.open) {
                                            closeLessonEditDialog();
                                        } else {
                                            closeLessonCreateDialog();
                                        }
                                    }}
                                    className="flex-1 h-11 border-2 border-gray-300 bg-white !text-gray-900 hover:!bg-gray-100 hover:!text-gray-900 font-semibold"
                                    disabled={lessonFormLoading}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={lessonFormLoading}
                                    className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                                >
                                    {lessonFormLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Đang lưu...
                                        </>
                                    ) : lessonEditMode.open ? (
                                        <>
                                            <Edit size={18} className="mr-2" />
                                            Cập nhật bài học
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} className="mr-2" />
                                            Tạo bài học
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </AdminPageLayout>
        </AdminGuard>
    );
}
