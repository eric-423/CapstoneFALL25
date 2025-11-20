package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.TrainingDTO;
import com.capstone.tamtech.capstone.entities.Role;
import com.capstone.tamtech.capstone.entities.Trainings;
import com.capstone.tamtech.capstone.entities.UserTraining;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.TrainingRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingSearchRequest;
import com.capstone.tamtech.capstone.repositories.LessonRepository;
import com.capstone.tamtech.capstone.repositories.RoleRepository;
import com.capstone.tamtech.capstone.repositories.TrainingRepository;
import com.capstone.tamtech.capstone.repositories.UserTrainingRepository;
import com.capstone.tamtech.capstone.services.impl.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class TrainingServiceImpl implements TrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserTrainingRepository userTrainingRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TrainingDTO> getAllTrainings(TrainingSearchRequest searchRequest) {
        if (searchRequest == null) {
            searchRequest = new TrainingSearchRequest();
        }
        Pageable pageable = createPageable(searchRequest);

        Boolean isActiveFilter = searchRequest.getIsActive();
        if (isActiveFilter == null) {
            boolean includeInactive = searchRequest.getIncludeInactive() != null && searchRequest.getIncludeInactive();
            isActiveFilter = includeInactive ? null : Boolean.TRUE;
        }

        String keyword = searchRequest.getKeyword();
        if (keyword != null && keyword.isBlank()) {
            keyword = null;
        }

        Page<Trainings> trainingPage = trainingRepository.searchTrainings(
                searchRequest.getRoleId(),
                isActiveFilter,
                keyword,
                pageable);

        List<TrainingDTO> content = trainingPage.getContent().stream()
                .map(training -> toDTO(training, true))
                .toList();

        return createPagedResponse(trainingPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingDTO getTrainingById(int id) {
        Trainings training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));
        return toDTO(training, true);
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingDTO getTrainingDetail(int id) {
        return getTrainingById(id);
    }

    @Override
    @Transactional
    public TrainingDTO createTraining(TrainingRequest request) {
        trainingRepository.findByName(request.getName()).ifPresent(t -> {
            throw new IllegalArgumentException("Training with the same name already exists");
        });

        Role role = null;
        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        }

        Trainings training = new Trainings();
        training.setName(request.getName());
        training.setNote(request.getNote());
        training.setPoint(request.getPoint() != null ? request.getPoint() : 0);
        training.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        training.setRole(role);
        training.setCreatedAt(new Date());
        training.setUpdateAt(new Date());

        Trainings saved = trainingRepository.save(training);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public TrainingDTO updateTraining(int id, TrainingRequest request) {
        Trainings training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            trainingRepository.findByName(request.getName()).ifPresent(t -> {
                if (t.getId() != id) {
                    throw new IllegalArgumentException("Training with the same name already exists");
                }
            });
            training.setName(request.getName());
        }

        if (request.getNote() != null) {
            training.setNote(request.getNote());
        }

        if (request.getPoint() != null) {
            training.setPoint(request.getPoint());
        }

        if (request.getIsActive() != null) {
            training.setIsActive(request.getIsActive());
        }

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            training.setRole(role);
        }

        training.setUpdateAt(new Date());

        Trainings updated = trainingRepository.save(training);
        return toDTO(updated, true);
    }

    @Override
    @Transactional
    public TrainingDTO updateTrainingStatus(int id, boolean isActive) {
        Trainings training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));
        training.setIsActive(isActive);
        training.setUpdateAt(new Date());
        Trainings saved = trainingRepository.save(training);
        return toDTO(saved, true);
    }

    @Override
    @Transactional
    public void deleteTraining(int id) {
        Trainings training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        List<UserTraining> userTrainings = userTrainingRepository.findByTraining_Id(id);
        boolean isUsed = userTrainings != null && !userTrainings.isEmpty();
        if (isUsed) {
            throw new IllegalStateException("Cannot delete training that is being used by users");
        }

        trainingRepository.delete(training);
    }

    private Pageable createPageable(TrainingSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }

        String sortBy = mapSortField(searchRequest.getSortBy());
        Sort.Direction direction = Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "name", "trainingname" -> "name";
            case "id", "trainingid" -> "id";
            case "point" -> "point";
            case "createdat", "createdate" -> "createdAt";
            case "role" -> "role.name";
            default -> "name";
        };
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

    private TrainingDTO toDTO(Trainings training) {
        return toDTO(training, false);
    }

    private TrainingDTO toDTO(Trainings training, boolean includeStats) {
        TrainingDTO dto = new TrainingDTO();
        dto.setId(training.getId());
        dto.setName(training.getName());
        dto.setNote(training.getNote());
        dto.setPoint(training.getPoint());
        dto.setCreatedAt(training.getCreatedAt());
        dto.setUpdateAt(training.getUpdateAt());
        dto.setIsActive(training.getIsActive());

        if (training.getRole() != null) {
            dto.setRoleId(training.getRole().getId());
            dto.setRoleName(training.getRole().getName());
        }

        if (includeStats) {
            dto.setLessonCount(lessonRepository.countByTraining_Id(training.getId()));
            dto.setTotalLessonPoint(lessonRepository.sumPointsByTrainingId(training.getId()));
        }

        return dto;
    }
}
