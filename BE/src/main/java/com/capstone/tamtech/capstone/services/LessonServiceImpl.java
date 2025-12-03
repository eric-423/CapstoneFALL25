package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.LessonDTO;
import com.capstone.tamtech.capstone.entities.Lessons;
import com.capstone.tamtech.capstone.entities.Trainings;
import com.capstone.tamtech.capstone.entities.UserLessonProcess;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.LessonOrderUpdateRequest;
import com.capstone.tamtech.capstone.payload.request.LessonRequest;
import com.capstone.tamtech.capstone.payload.request.LessonSearchRequest;
import com.capstone.tamtech.capstone.repositories.LessonRepository;
import com.capstone.tamtech.capstone.repositories.TrainingRepository;
import com.capstone.tamtech.capstone.repositories.UserLessonProcessRepository;
import com.capstone.tamtech.capstone.services.impl.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private UserLessonProcessRepository userLessonProcessRepository;

    @Override
    public PagedResponse<LessonDTO> getLessonByTrainingId(int trainingId, LessonSearchRequest searchRequest) {
        if (searchRequest == null) {
            searchRequest = new LessonSearchRequest();
        }
        Pageable pageable = createPageable(searchRequest);
        Page<Lessons> lessonPage = lessonRepository.findByTraining_Id(trainingId, pageable);
        List<LessonDTO> content = lessonPage.getContent().stream()
                .map(this::toDTO)
                .toList();
        return createPagedResponse(lessonPage, content);
    }

    @Override
    public List<LessonDTO> getLessonsForTraining(int trainingId) {
        return lessonRepository.findByTraining_IdOrderByOrderIndexAsc(trainingId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private Pageable createPageable(LessonSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }

        String sortBy = searchRequest.getSortBy() != null ? searchRequest.getSortBy() : "orderIndex";
        Sort.Direction direction = Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private <T> PagedResponse<T> createPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        response.setEmpty(page.isEmpty());
        return response;
    }

    private LessonDTO toDTO(Lessons lessons) {
        return LessonDTO.builder()
                .id(lessons.getId())
                .title(lessons.getTitle())
                .content(lessons.getContent())
                .description(lessons.getDescription())
                .videoUrl(lessons.getVideoUrl())
                .point(lessons.getPoint())
                .orderIndex(lessons.getOrderIndex())
                .trainingId(lessons.getTraining().getId())
                .isActive(lessons.isActive())
                .build();
    }

    @Override
    public LessonDTO getLessonById(int lessonId) {
        return this.toDTO(lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found")));
    }

    @Override
    public LessonDTO createLesson(int trainingId, LessonRequest lessonRequest) {
        Lessons lesson = new Lessons();

        Trainings trainings = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        lesson.setTitle(lessonRequest.getTitle());
        lesson.setContent(lessonRequest.getContent());
        lesson.setDescription(lessonRequest.getDescription());
        lesson.setVideoUrl(lessonRequest.getVideoUrl());
        lesson.setPoint(lessonRequest.getPoint());
        lesson.setOrderIndex(resolveOrderIndex(trainingId, lessonRequest.getOrderIndex()));
        lesson.setTraining(trainings);

        Lessons saved = lessonRepository.save(lesson);
        normalizeLessonOrders(trainingId);
        return toDTO(saved);
    }

    @Override
    public LessonDTO updateLesson(int lessonId, LessonRequest lessonRequest) {
        Lessons lessons = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        Trainings trainings = trainingRepository.findById(lessonRequest.getTrainingId())
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        lessons.setTitle(lessonRequest.getTitle());
        lessons.setContent(lessonRequest.getContent());
        lessons.setDescription(lessonRequest.getDescription());
        lessons.setVideoUrl(lessonRequest.getVideoUrl());
        lessons.setPoint(lessonRequest.getPoint());
        if (lessonRequest.getOrderIndex() != null) {
            lessons.setOrderIndex(lessonRequest.getOrderIndex());
        }
        lessons.setTraining(trainings);
        lessons.setActive(lessonRequest.getIsActive() != null ? lessonRequest.getIsActive() : lessons.isActive());

        Lessons updated = lessonRepository.save(lessons);
        normalizeLessonOrders(trainings.getId());

        return toDTO(updated);
    }

    @Override
    public LessonDTO inActiveLesson(int lessonId, boolean isActive) {
        Lessons lessons = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        lessons.setActive(isActive);

        return toDTO(lessonRepository.save(lessons));
    }

    @Override
    public LessonDTO updateLessonOrder(int lessonId, int orderIndex) {
        Lessons lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        lesson.setOrderIndex(orderIndex);
        Lessons saved = lessonRepository.save(lesson);
        normalizeLessonOrders(lesson.getTraining().getId());
        return toDTO(saved);
    }

    @Override
    public List<LessonDTO> updateLessonOrders(int trainingId, List<LessonOrderUpdateRequest.OrderItem> orders) {
        Trainings training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        if (orders == null || orders.isEmpty()) {
            return getLessonsForTraining(trainingId);
        }

        for (LessonOrderUpdateRequest.OrderItem order : orders) {
            if (order.getLessonId() == null || order.getOrderIndex() == null) {
                continue;
            }
            Lessons lesson = lessonRepository.findById(order.getLessonId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Lesson not found with id: " + order.getLessonId()));
            if (lesson.getTraining().getId() != training.getId()) {
                throw new IllegalArgumentException(
                        "Lesson " + order.getLessonId() + " does not belong to training " + trainingId);
            }
            lesson.setOrderIndex(order.getOrderIndex());
            lessonRepository.save(lesson);
        }

        normalizeLessonOrders(trainingId);
        return getLessonsForTraining(trainingId);
    }

    @Override
    public Map<String, Object> getMyLessonByTrainingId(int trainingId,
            int userId) {

        List<Lessons> lessons = lessonRepository.findByTraining_IdOrderByOrderIndexAsc(trainingId);
        List<LessonDTO> lessonDTOS = lessonRepository.findByTraining_IdOrderByOrderIndexAsc(trainingId)
                .stream()
                .map(this::toDTO)
                .toList();

        lessonDTOS.forEach(lessonDTO -> {
            UserLessonProcess userLessonProcess = userLessonProcessRepository
                    .findByUserTraining_IdAndLesson_Id(userId, lessonDTO.getId())
                    .orElse(null);
            if (userLessonProcess != null) {
                lessonDTO.setIsCompleted(userLessonProcess.getIsLearned());
            } else {
                lessonDTO.setIsCompleted(false);
            }
        });

        long completedLessons = lessonDTOS.stream()
                .filter(lessonDTO -> Boolean.TRUE.equals(lessonDTO.getIsCompleted()))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("lessons", lessonDTOS);
        response.put("totalLessons", lessonDTOS.size());
        response.put("completedLessons", completedLessons);

        return response;
    }

    private int resolveOrderIndex(int trainingId, Integer desiredOrder) {
        if (desiredOrder == null || desiredOrder <= 0) {
            return lessonRepository.findLessonsByTraining_Id(trainingId).size() + 1;
        }
        return desiredOrder;
    }

    private void normalizeLessonOrders(int trainingId) {
        List<Lessons> lessons = lessonRepository.findByTraining_IdOrderByOrderIndexAsc(trainingId);
        for (int i = 0; i < lessons.size(); i++) {
            lessons.get(i).setOrderIndex(i + 1);
        }
        lessonRepository.saveAll(lessons);
    }

}
