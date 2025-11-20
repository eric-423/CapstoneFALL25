package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.payload.request.AssignUsersToTrainingRequest;
import com.capstone.tamtech.capstone.payload.request.UserTrainingUpdateRequest;

import java.util.List;

public interface UserTrainingService {

    int assignUsersToTraining(int trainingId, AssignUsersToTrainingRequest request);

    List<UserTrainingDTO> getUserTrainingsByTraining(int trainingId);

    List<UserTrainingDTO> getTrainingsByUser(int userId);

    UserTrainingDTO updateUserTraining(int userTrainingId, UserTrainingUpdateRequest request);

    List<UserTrainingDTO> getMyTrainings(String status);

    UserTrainingDetailDTO getMyTrainingDetail(int userTrainingId);

    UserTrainingDTO enrollCurrentUser(int trainingId);

    UserTrainingProgressDTO getMyTrainingProgress(int userTrainingId);

    LessonProgressDTO getMyLessonDetail(int userTrainingId, int lessonId);

    LessonProgressDTO startLesson(int userTrainingId, int lessonId);

    LessonProgressDTO completeLesson(int userTrainingId, int lessonId);

    List<DocumentDTO> getLessonDocumentsForCurrentUser(int lessonId);
}
