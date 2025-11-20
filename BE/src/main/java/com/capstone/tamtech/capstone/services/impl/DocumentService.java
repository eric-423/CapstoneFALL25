package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.DocumentDTO;
import com.capstone.tamtech.capstone.payload.request.DocumentRequest;

import java.util.List;

public interface DocumentService {

    List<DocumentDTO> getDocumentsByLessonId(int lessonId);

    DocumentDTO createDocument(int lessonId, DocumentRequest request);

    DocumentDTO updateDocument(int documentId, DocumentRequest request);

    void deleteDocument(int documentId);
}
