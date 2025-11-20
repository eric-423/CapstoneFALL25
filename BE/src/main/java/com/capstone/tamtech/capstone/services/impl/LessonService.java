package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.LessonDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.LessonOrderUpdateRequest;
import com.capstone.tamtech.capstone.payload.request.LessonRequest;
import com.capstone.tamtech.capstone.payload.request.LessonSearchRequest;

import java.util.List;

public interface LessonService {

    PagedResponse<LessonDTO> getLessonByTrainingId(int trainingId, LessonSearchRequest searchRequest);

    List<LessonDTO> getLessonsForTraining(int trainingId);

    LessonDTO getLessonById(int lessonId);

    LessonDTO createLesson(int trainingId, LessonRequest lessonRequest);

    LessonDTO updateLesson(int lessonId, LessonRequest lessonRequest);

    LessonDTO inActiveLesson(int lessonId, boolean isActive);

    LessonDTO updateLessonOrder(int lessonId, int orderIndex);

    List<LessonDTO> updateLessonOrders(int trainingId, List<LessonOrderUpdateRequest.OrderItem> orders);

}
