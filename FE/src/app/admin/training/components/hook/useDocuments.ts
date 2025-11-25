"use client";

import { useEffect, useState } from "react";
import {
  getLessonDocuments,
  LessonDocument,
  createLessonDocument,
  updateLessonDocument,
  deleteLessonDocument,
  CreateDocumentPayload,
} from "@/apis/trainning.api";

export function useDocuments(lessonId: number | null) {
  const [documents, setDocuments] = useState<LessonDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!lessonId) {
      setDocuments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getLessonDocuments(lessonId);
      setDocuments(response?.data ?? []);
    } catch (err) {
      const serverDesc =
        (err as { response?: { data?: { desc?: string; error?: string } } })
          ?.response?.data?.desc ||
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        (err instanceof Error
          ? err.message
          : "Không thể tải danh sách tài liệu");
      setError(serverDesc);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const createDocument = async (payload: CreateDocumentPayload) => {
    if (!lessonId) throw new Error("Lesson ID is required");

    if (!payload.refLink?.trim()) {
      throw new Error("Vui lòng nhập link tài liệu.");
    }

    const finalPayload: CreateDocumentPayload = {
      ...payload,
      refLink: payload.refLink.trim(),
      lessonId,
    };

    await createLessonDocument(lessonId, finalPayload);
    await fetchDocuments();
  };

  const updateDocument = async (
    documentId: number,
    payload: CreateDocumentPayload
  ) => {
    if (!lessonId) throw new Error("Lesson ID is required");

    if (!payload.refLink?.trim()) {
      throw new Error("Vui lòng nhập link tài liệu.");
    }

    const finalPayload: CreateDocumentPayload = {
      ...payload,
      refLink: payload.refLink.trim(),
      lessonId,
    };

    await updateLessonDocument(documentId, finalPayload);
    await fetchDocuments();
  };

  const removeDocument = async (documentId: number) => {
    await deleteLessonDocument(documentId);
    await fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    removeDocument,
    refetch: fetchDocuments,
  };
}

