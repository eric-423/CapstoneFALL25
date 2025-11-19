package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.TrainingDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.TrainingRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingSearchRequest;

public interface TrainingService {
    PagedResponse<TrainingDTO> getAllTrainings(TrainingSearchRequest searchRequest);

    TrainingDTO getTrainingById(int id);

    TrainingDTO createTraining(TrainingRequest request);

    TrainingDTO updateTraining(int id, TrainingRequest request);

    void deleteTraining(int id);
}
