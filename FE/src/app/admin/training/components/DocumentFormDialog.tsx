"use client";

import { useState, useEffect } from "react";
import { FileText, Edit, Plus, ExternalLink, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LessonDocument, CreateDocumentPayload } from "@/apis/trainning.api";
import { useDocuments } from "./hook/useDocuments";
import { toast } from "react-toastify";
import { useBodyScrollLock } from "../../components/useBodyScrollLock";
import { uploadMediaToSupabase } from "@/components/common/upFileToSupabase";

const TRAINING_DOCUMENT_BUCKET =
    process.env.NEXT_PUBLIC_SUPABASE_TRAINING_DOC_BUCKET ??
    process.env.NEXT_PUBLIC_SUPABASE_TRAINING_BUCKET;

const MAX_DOCUMENT_SIZE_MB = 50;
const MAX_DOCUMENT_SIZE = MAX_DOCUMENT_SIZE_MB * 1024 * 1024;

interface DocumentFormDialogProps {
    open: boolean;
    mode: "create" | "edit";
    document?: LessonDocument | null;
    lessonId: number | null;
    onClose: () => void;
    onSuccess: () => void;
    onRefetch?: () => void;
}

export function DocumentFormDialog({
    open,
    mode,
    document,
    lessonId,
    onClose,
    onSuccess,
    onRefetch,
}: DocumentFormDialogProps) {
    const { createDocument, updateDocument } = useDocuments(lessonId);
    const [form, setForm] = useState({
        name: "",
        refLink: "",
        description: "",
    });
    const [documentSource, setDocumentSource] = useState<"link" | "upload">("link");
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);

    useEffect(() => {
        if (open && mode === "edit" && document) {
            setForm({
                name: document.name ?? "",
                refLink: document.refLink ?? "",
                description: document.description ?? "",
            });
            setDocumentSource("link");
        } else if (open && mode === "create") {
            setForm({ name: "", refLink: "", description: "" });
            setDocumentSource("link");
        }
        setFile(null);
        setErrors({});
    }, [open, mode, document]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim())
            newErrors.name = "Vui lòng nhập tên tài liệu";
        if (!form.description.trim())
            newErrors.description = "Vui lòng nhập mô tả";
        if (documentSource === "link") {
            if (!form.refLink?.trim())
                newErrors.refLink = "Vui lòng nhập link tài liệu";
        } else {
            if (!file) {
                newErrors.file = "Vui lòng chọn file để tải lên";
            } else if (file.size > MAX_DOCUMENT_SIZE) {
                newErrors.file = `File không được vượt quá ${MAX_DOCUMENT_SIZE_MB}MB`;
            } else if (/[^\x00-\x7F]/.test(file.name)) {
                newErrors.file = "Tên file không được chứa dấu. Vui lòng đổi tên không dấu.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonId) return;
        if (!validate()) return;

        try {
            setLoading(true);
            let documentLink = form.refLink?.trim() ?? "";

            if (documentSource === "upload") {
                if (!TRAINING_DOCUMENT_BUCKET) {
                    throw new Error("Chưa cấu hình bucket Supabase cho tài liệu");
                }
                if (!file) {
                    setErrors((prev) => ({ ...prev, file: "Vui lòng chọn file để tải lên" }));
                    return;
                }

                const uploadResult = await uploadMediaToSupabase({
                    bucket: TRAINING_DOCUMENT_BUCKET,
                    file,
                    folder: `training-documents/${lessonId}`,
                });
                documentLink = uploadResult.publicUrl;
            }

            const payload: CreateDocumentPayload = {
                name: form.name.trim(),
                refLink: documentLink,
                description: form.description.trim(),
                lessonId,
            };

            if (mode === "edit" && document) {
                await updateDocument(document.id, payload);
                toast.success("Cập nhật tài liệu thành công!", { toastId: `update-doc-${document.id}` });
            } else {
                await createDocument(payload);
                toast.success("Tạo tài liệu mới thành công!", { toastId: "create-doc" });
            }

            if (onRefetch) {
                onRefetch();
            }
            setFile(null);
            setDocumentSource("link");
            onSuccess();
            onClose();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : mode === "edit"
                        ? "Không thể cập nhật tài liệu"
                        : "Không thể tạo tài liệu";
            toast.error(message, { toastId: `doc-error-${mode}` });
            setErrors({ form: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4 border-2 border-primary bg-white">
            <div className="mb-3 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <p className="text-sm font-semibold text-gray-700">
                    {mode === "edit" ? "Cập nhật tài liệu" : "Thêm tài liệu mới"}
                </p>
            </div>
            {errors.form && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {errors.form}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                        Tên tài liệu <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tên tài liệu"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className={`h-9 text-sm border-2 ${errors.name ? "border-red-400" : "border-gray-200"
                            } focus:border-primary`}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        <span>Nguồn tài liệu</span>
                        <div className="inline-flex items-center gap-2 text-[11px] text-gray-500">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary cursor-pointer"
                                checked={documentSource === "upload"}
                                onChange={(e) => {
                                    const useUpload = e.target.checked;
                                    if (useUpload) {
                                        setDocumentSource("upload");
                                        setForm((prev) => ({ ...prev, refLink: "" }));
                                        setErrors((prev) => {
                                            const { refLink, ...rest } = prev;
                                            return rest;
                                        });
                                    } else {
                                        setDocumentSource("link");
                                        setErrors((prev) => {
                                            const { file, ...rest } = prev;
                                            return rest;
                                        });
                                        setFile(null);
                                    }
                                }}
                                aria-label="Bật để tải file lên Supabase"
                            />
                            <Upload size={12} className={documentSource === "upload" ? "text-primary" : "text-gray-400"} />
                            <span>Tải file lên</span>
                        </div>
                    </label>

                </div>

                {documentSource === "link" ? (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">
                            Link tài liệu <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Nhập link tài liệu (URL)"
                            value={form.refLink}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, refLink: e.target.value }))
                            }
                            className={`h-9 text-sm border-2 ${errors.refLink ? "border-red-400" : "border-gray-200"
                                } focus:border-primary`}
                        />
                        {mode === "edit" && document?.refLink && (
                            <a
                                href={document.refLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary underline-offset-4 hover:underline inline-flex items-center gap-1"
                            >
                                Xem tài liệu hiện tại
                                <ExternalLink size={12} />
                            </a>
                        )}
                        {errors.refLink && (
                            <p className="text-xs text-red-500">{errors.refLink}</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">
                            Upload file tài liệu <span className="text-red-500">*</span>
                        </label>
                        <input
                            title="Upload file tài liệu"
                            placeholder="Chọn file tài liệu"
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-xs text-gray-600 border-2 border-gray-200 rounded-md cursor-pointer focus:border-primary file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        />
                        {file && (
                            <p className="text-[11px] text-gray-500">Đã chọn: {file.name}</p>
                        )}
                        <p className="text-[11px] text-gray-500">
                            Hỗ trợ các định dạng phổ biến (PDF, DOCX, PPTX...) tối đa {MAX_DOCUMENT_SIZE_MB}MB
                        </p>
                        {errors.file && (
                            <p className="text-xs text-red-500">{errors.file}</p>
                        )}
                    </div>
                )}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                        Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Nhập mô tả tài liệu"
                        value={form.description}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className={`w-full text-sm rounded-md border-2 px-3 py-2 ${errors.description ? "border-red-400" : "border-gray-200"
                            } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none`}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">{errors.description}</p>
                    )}
                </div>
                <div className="flex gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="flex-1 h-9 text-sm"
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-1 h-9 text-sm bg-primary text-white hover:bg-primary/80"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                Đang lưu...
                            </>
                        ) : mode === "edit" ? (
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
    );
}

