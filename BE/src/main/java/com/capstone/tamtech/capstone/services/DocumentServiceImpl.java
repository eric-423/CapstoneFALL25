package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.DocumentDTO;
import com.capstone.tamtech.capstone.entities.Documents;
import com.capstone.tamtech.capstone.entities.Lessons;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.DocumentRequest;
import com.capstone.tamtech.capstone.repositories.DocumentRepository;
import com.capstone.tamtech.capstone.repositories.LessonRepository;
import com.capstone.tamtech.capstone.services.impl.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByLessonId(int lessonId) {
        lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        return documentRepository.findByLesson_IdOrderByIdAsc(lessonId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public DocumentDTO createDocument(int lessonId, DocumentRequest request) {
        Lessons lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        Documents document = new Documents();
        document.setLesson(lesson);
        document.setName(request.getName());
        document.setRefLink(request.getRefLink());
        document.setDescription(request.getDescription());
        Documents saved = documentRepository.save(document);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public DocumentDTO updateDocument(int documentId, DocumentRequest request) {
        Documents document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        if (request.getName() != null) {
            document.setName(request.getName());
        }
        if (request.getRefLink() != null) {
            document.setRefLink(request.getRefLink());
        }
        if (request.getDescription() != null) {
            document.setDescription(request.getDescription());
        }
        if (request.getLessonId() != null && !request.getLessonId().equals(document.getLesson().getId())) {
            Lessons lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
            document.setLesson(lesson);
        }
        return toDTO(documentRepository.save(document));
    }

    @Override
    @Transactional
    public void deleteDocument(int documentId) {
        Documents document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        documentRepository.delete(document);
    }

    private DocumentDTO toDTO(Documents document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setName(document.getName());
        dto.setRefLink(document.getRefLink());
        dto.setDescription(document.getDescription());
        if (document.getLesson() != null) {
            dto.setLessonId(document.getLesson().getId());
        }
        return dto;
    }
}
