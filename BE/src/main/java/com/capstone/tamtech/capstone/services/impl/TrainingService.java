package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.TrainingDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.TrainingRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingSearchRequest;

public interface TrainingService {
    PagedResponse<TrainingDTO> getAllTrainings(TrainingSearchRequest searchRequest);

    TrainingDTO getTrainingById(int id);

    TrainingDTO getTrainingDetail(int id);

    TrainingDTO createTraining(TrainingRequest request);

    TrainingDTO updateTraining(int id, TrainingRequest request);

    TrainingDTO updateTrainingStatus(int id, boolean isActive);

    void deleteTraining(int id);
}
