package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.DocumentRequest;
import com.capstone.tamtech.capstone.services.impl.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/admin/lessons/{lessonId}")
    public ResponseEntity<?> getDocumentByLessonId(@PathVariable Integer lessonId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(documentService.getDocumentsByLessonId(lessonId));
        responseData.setDesc("Retrieved documents for lesson " + lessonId);
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/admin/lessons/{lessonId}")
    public ResponseEntity<?> uploadDocumentToLesson(@PathVariable Integer lessonId,
            @RequestBody DocumentRequest documentRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(documentService.createDocument(lessonId, documentRequest));
        responseData.setDesc("Document created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @PutMapping("/admin/{documentId}")
    public ResponseEntity<?> updateDocumentMetadata(@PathVariable Integer documentId,
            @RequestBody DocumentRequest documentRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(documentService.updateDocument(documentId, documentRequest));
        responseData.setDesc("Document updated successfully");
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/admin/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable Integer documentId) {
        documentService.deleteDocument(documentId);
        ResponseData responseData = new ResponseData();
        responseData.setDesc("Document deleted successfully");
        return ResponseEntity.ok(responseData);
    }

}
