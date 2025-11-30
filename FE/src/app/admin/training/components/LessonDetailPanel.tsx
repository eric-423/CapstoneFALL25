"use client";

import { useState } from "react";
import { ArrowLeft, Edit, FileText, Plus, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrainingLesson, LessonDocument } from "@/apis/trainning.api";
import { DocumentFormDialog } from "./DocumentFormDialog";
import { useDocuments } from "./hook/useDocuments";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";

interface LessonDetailPanelProps {
  lesson: TrainingLesson | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onEdit: (lesson: TrainingLesson) => void;
}

export function LessonDetailPanel({
  lesson,
  loading,
  error,
  onBack,
  onEdit,
}: LessonDetailPanelProps) {
  const { documents, loading: documentsLoading, error: documentsError, removeDocument, refetch: refetchDocuments } =
    useDocuments(lesson?.id ?? null);
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [documentEditMode, setDocumentEditMode] = useState<{
    open: boolean;
    document: LessonDocument | null;
  }>({
    open: false,
    document: null,
  });
  const [documentToDelete, setDocumentToDelete] =
    useState<LessonDocument | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(
    null
  );
  useBodyScrollLock(
    documentFormOpen || documentEditMode.open || !!documentToDelete
  );

  const handleDeleteDocument = async () => {
    if (!documentToDelete || !lesson) return;
    try {
      setDeletingDocumentId(documentToDelete.id);
      await removeDocument(documentToDelete.id);
      toast.success("Xóa tài liệu thành công!", { toastId: `delete-doc-${documentToDelete.id}` });
      setDocumentToDelete(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể xóa tài liệu";
      toast.error(message, { toastId: `delete-doc-error-${documentToDelete.id}` });
    } finally {
      setDeletingDocumentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-6">
        <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
        Đang tải bài học...
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 py-4">{error}</p>;
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center mb-3 mt-5 bg-primary text-white text-sm font-semibold hover:bg-primary/80 px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          Quay lại
        </button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onEdit(lesson)}
          className="border-2 border-primary text-primary bg-primary hover:bg-primary font-semibold rounded-xl transition-all"
        >
          <Edit size={16} className="mr-1" strokeWidth={2.5} />
          Sửa
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-gray-900">{lesson.title}</p>
        <p className="text-sm text-gray-500">
          Thứ tự #{lesson.orderIndex} ·{" "}
          {lesson.isActive ? "Đang hoạt động" : "Đã ẩn"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Điểm bài học", value: lesson.point },
          { label: "Thuộc khóa", value: lesson.trainingId },
          { label: "ID", value: lesson.id },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border border-gray-100 shadow-none">
            <p className="text-xs uppercase text-gray-500 font-semibold">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Mô tả</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Nội dung</p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>
      </div>

      {lesson.videoUrl && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Video bài học</p>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <video
              controls
              className="w-full rounded-lg"
              src={lesson.videoUrl}
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Video từ tài liệu</p>
          <div className="space-y-3">
            {documents
              .filter((doc) => {
                if (!doc.refLink) return false;
                const url = doc.refLink.toLowerCase();
                return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('video');
              })
              .map((doc) => (
                <div key={doc.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{doc.name}</p>
                  {doc.description && (
                    <p className="text-xs text-gray-600 mb-3">{doc.description}</p>
                  )}
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={doc.refLink}
                  >
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <p className="text-sm font-semibold text-gray-700">
              Tài liệu đính kèm
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setDocumentEditMode({ open: false, document: null });
              setDocumentFormOpen(true);
            }}
            disabled={documentsLoading || documentFormOpen}
            className="bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {documentsLoading ? (
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

        {documentFormOpen && !documentEditMode.open && (
          <DocumentFormDialog
            open={true}
            mode="create"
            lessonId={lesson.id}
            onClose={() => setDocumentFormOpen(false)}
            onSuccess={() => setDocumentFormOpen(false)}
            onRefetch={refetchDocuments}
          />
        )}

        {documentsLoading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            Đang tải tài liệu...
          </div>
        ) : documentsError ? (
          <p className="text-sm text-red-500 py-2">{documentsError}</p>
        ) : documents.length === 0 && !documentFormOpen ? (
          <p className="text-sm text-gray-500 py-2">
            Chưa có tài liệu nào cho bài học này.
          </p>
        ) : (
          <>
            {documents.length > 0 && (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const isEditingThisDoc =
                    documentEditMode.open &&
                    documentEditMode.document?.id === doc.id;
                  return (
                    <div key={doc.id} className="space-y-3">
                      <Card
                        className={`p-4 border transition-colors bg-white ${
                          isEditingThisDoc
                            ? "border-2 border-primary"
                            : "border-gray-200 hover:border-primary"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {doc.name}
                              </p>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setDocumentEditMode({ open: true, document: doc })
                                }
                                disabled={
                                  documentFormOpen ||
                                  deletingDocumentId === doc.id ||
                                  isEditingThisDoc ||
                                  (documentEditMode.open &&
                                    documentEditMode.document?.id !== doc.id)
                                }
                                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                              >
                                <Edit size={14} className="mr-1" strokeWidth={2.5} />
                                Sửa
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setDocumentToDelete(doc)}
                                disabled={
                                  documentFormOpen ||
                                  deletingDocumentId === doc.id ||
                                  isEditingThisDoc ||
                                  (documentEditMode.open &&
                                    documentEditMode.document?.id !== doc.id)
                                }
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
                      </Card>
                      {isEditingThisDoc && (
                        <DocumentFormDialog
                          open={true}
                          mode="edit"
                          document={doc}
                          lessonId={lesson.id}
                          onClose={() =>
                            setDocumentEditMode({ open: false, document: null })
                          }
                          onSuccess={() => {
                            setDocumentEditMode({ open: false, document: null });
                          }}
                          onRefetch={refetchDocuments}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog
        open={!!documentToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDocumentToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xoá tài liệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá tài liệu{" "}
              <span className="font-semibold text-primary">
                {documentToDelete?.name ?? ""}
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
                "Xoá ngay"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

