package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.AssignUsersToTrainingRequest;
import com.capstone.tamtech.capstone.payload.request.UserTrainingUpdateRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.DocumentService;
import com.capstone.tamtech.capstone.services.impl.UserTrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserTrainingServiceImpl implements UserTrainingService {

    @Autowired
    private UserTrainingRepository userTrainingRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserLessonProcessRepository userLessonProcessRepository;

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private DocumentService documentService;

    @Override
    @Transactional
    public int assignUsersToTraining(int trainingId, AssignUsersToTrainingRequest request) {
        Trainings training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        List<Users> targetUsers = new ArrayList<>();
        if (request.getUserIds() != null && !request.getUserIds().isEmpty()) {
            targetUsers.addAll(usersRepository.findAllById(request.getUserIds()));
        } else if (request.getRoleId() != null || request.getBranchId() != null) {
            targetUsers.addAll(roleHistoryRepository.findActiveUsersByRoleAndBranch(
                    request.getRoleId(),
                    request.getBranchId()));
        } else {
            throw new IllegalArgumentException("userIds or branchId/roleId must be provided");
        }

        int assignedCount = 0;
        Set<Integer> processedUserIds = new HashSet<>();
        for (Users user : targetUsers) {
            if (user == null) {
                continue;
            }
            if (!processedUserIds.add(user.getId())) {
                continue;
            }
            boolean exists = userTrainingRepository.findByTraining_IdAndUser_Id(trainingId, user.getId()).isPresent();
            if (exists) {
                continue;
            }

            UserTraining userTraining = new UserTraining();
            userTraining.setTraining(training);
            userTraining.setUser(user);
            userTraining.setEnrolledAt(new Date());
            userTraining.setPoint(0);
            userTraining.setIsPassed(false);
            userTrainingRepository.save(userTraining);
            assignedCount++;
        }

        return assignedCount;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserTrainingDTO> getUserTrainingsByTraining(int trainingId) {
        return userTrainingRepository.findByTraining_Id(trainingId)
                .stream()
                .map(this::toDtoWithStats)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserTrainingDTO> getTrainingsByUser(int userId) {
        return userTrainingRepository.findByUser_Id(userId)
                .stream()
                .map(this::toDtoWithStats)
                .toList();
    }

    @Override
    @Transactional
    public UserTrainingDTO updateUserTraining(int userTrainingId, UserTrainingUpdateRequest request) {
        UserTraining userTraining = userTrainingRepository.findById(userTrainingId)
                .orElseThrow(() -> new ResourceNotFoundException("User training not found"));
        if (request.getPoint() != null) {
            userTraining.setPoint(request.getPoint());
        }
        if (request.getIsPassed() != null) {
            userTraining.setIsPassed(request.getIsPassed());
        }
        if (request.getCompletedAt() != null) {
            userTraining.setCompletedAt(request.getCompletedAt());
        }
        UserTraining saved = userTrainingRepository.save(userTraining);
        return toDtoWithStats(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserTrainingDTO> getMyTrainings(String status) {
        Users currentUser = getCurrentUser();
        System.out.println("Current User ID: " + currentUser.getId());

        List<Integer> trainingsId = trainingRepository.findByRole_IdAndIsActive(currentUser.getRoleHistories().stream().filter(rh -> rh.isActive()).findFirst().get().getRole().getId(), true).stream().map(Trainings::getId).toList();
        List<UserTrainingDTO> result = new ArrayList<>();
        List<UserTraining> userTrainings = userTrainingRepository.findByUser_Id(currentUser.getId());

        for (Integer trainingId : trainingsId) {

            UserTraining userTraining = null;

            for (UserTraining item : userTrainings) {
                if (item.getTraining().getId() == trainingId) {
                    userTraining = item;
                    break;
                }
            }

            if(userTraining!=null){
                result.add(toDtoWithStats(userTraining));
            } else{
                UserTrainingDTO userTrainingDTO = new UserTrainingDTO();
                Trainings trainings = trainingRepository.findById(trainingId).orElseThrow(() -> new ResourceNotFoundException("Training not found"));

                userTrainingDTO.setTrainingId(trainings.getId());
                userTrainingDTO.setTrainingName(trainings.getName());
                userTrainingDTO.setTrainingPoint(0);
                userTrainingDTO.setUserId(currentUser.getId());
                userTrainingDTO.setUserFullName(currentUser.getFullName());
                userTrainingDTO.setUserEmail(currentUser.getEmail());
                userTrainingDTO.setUserPhone(currentUser.getPhoneNumber());
                userTrainingDTO.setPoint(0);
                userTrainingDTO.setIsPassed(false);
                userTrainingDTO.setTotalLessons(trainings.getLessonsList().size());
                userTrainingDTO.setCompletedLessons(0);
                userTrainingDTO.setCompletionPercent(0.0);
                userTrainingDTO.setStatus("NOT_STARTED");
                userTrainingDTO.setEnrolledAt(null);
                userTrainingDTO.setCompletedAt(null);

                result.add((userTrainingDTO));
            }
        }


        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public UserTrainingDetailDTO getMyTrainingDetail(int userTrainingId) {
        UserTraining userTraining = getUserTrainingForCurrentUser(userTrainingId);
        UserTrainingDTO summary = toDtoWithStats(userTraining);

        List<Lessons> lessons = lessonRepository.findByTraining_IdOrderByOrderIndexAsc(
                userTraining.getTraining().getId());
        Map<Integer, UserLessonProcess> progressMap = userLessonProcessRepository
                .findByUserTraining_Id(userTrainingId)
                .stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        List<LessonProgressDTO> lessonDtos = lessons.stream()
                .map(lesson -> {
                    UserLessonProcess progress = progressMap.get(lesson.getId());
                    return LessonProgressDTO.builder()
                            .lessonId(lesson.getId())
                            .title(lesson.getTitle())
                            .description(lesson.getDescription())
                            .content(lesson.getContent())
                            .point(lesson.getPoint())
                            .orderIndex(lesson.getOrderIndex())
                            .isLearned(progress != null && Boolean.TRUE.equals(progress.getIsLearned()))
                            .startDate(progress != null ? progress.getStartDate() : null)
                            .completedAt(progress != null ? progress.getCompletedAt() : null)
                            .build();
                })
                .toList();

        return UserTrainingDetailDTO.builder()
                .summary(summary)
                .lessons(lessonDtos)
                .build();
    }

    @Override
    @Transactional
    public UserTrainingDTO enrollCurrentUser(int trainingId) {
        Users currentUser = getCurrentUser();
        UserTraining existing = userTrainingRepository.findByTraining_IdAndUser_Id(trainingId, currentUser.getId())
                .orElse(null);
        if (existing != null) {
            return toDtoWithStats(existing);
        }

        Trainings training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        UserTraining userTraining = new UserTraining();
        userTraining.setUser(currentUser);
        userTraining.setTraining(training);
        userTraining.setEnrolledAt(new Date());
        userTraining.setPoint(0);
        userTraining.setIsPassed(false);
        return toDtoWithStats(userTrainingRepository.save(userTraining));
    }

    @Override
    @Transactional(readOnly = true)
    public UserTrainingProgressDTO getMyTrainingProgress(int userTrainingId) {
        UserTraining userTraining = getUserTrainingForCurrentUser(userTrainingId);
        return buildProgressDto(userTraining);
    }

    @Override
    @Transactional(readOnly = true)
    public LessonProgressDTO getMyLessonDetail(int userTrainingId, int lessonId) {
        UserTraining userTraining = getUserTrainingForCurrentUser(userTrainingId);
        Lessons lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        if (lesson.getTraining().getId() != userTraining.getTraining().getId()) {
            throw new AccessDeniedException("Lesson does not belong to training");
        }
        UserLessonProcess progress = userLessonProcessRepository
                .findByUserTraining_IdAndLesson_Id(userTrainingId, lessonId)
                .orElse(null);
        return toLessonProgressDto(lesson, progress);
    }

    @Override
    @Transactional
    public LessonProgressDTO startLesson(int userTrainingId, int lessonId) {
        UserTraining userTraining = getUserTrainingForCurrentUser(userTrainingId);
        Lessons lesson = verifyLessonBelongsToTraining(lessonId, userTraining);

        UserLessonProcess progress = userLessonProcessRepository
                .findByUserTraining_IdAndLesson_Id(userTrainingId, lessonId)
                .orElseGet(() -> {
                    UserLessonProcess process = new UserLessonProcess();
                    process.setLesson(lesson);
                    process.setUserTraining(userTraining);
                    return process;
                });
        if (progress.getStartDate() == null) {
            progress.setStartDate(new Date());
        }
        UserLessonProcess saved = userLessonProcessRepository.save(progress);
        return toLessonProgressDto(lesson, saved);
    }

    @Override
    @Transactional
    public LessonProgressDTO completeLesson(int userTrainingId, int lessonId) {
        UserTraining userTraining = getUserTrainingForCurrentUser(userTrainingId);
        Lessons lesson = verifyLessonBelongsToTraining(lessonId, userTraining);

        UserLessonProcess progress = userLessonProcessRepository
                .findByUserTraining_IdAndLesson_Id(userTrainingId, lessonId)
                .orElseGet(() -> {
                    UserLessonProcess process = new UserLessonProcess();
                    process.setLesson(lesson);
                    process.setUserTraining(userTraining);
                    process.setStartDate(new Date());
                    return process;
                });

        boolean wasLearned = progress.getIsLearned() != null && progress.getIsLearned();
        progress.setIsLearned(true);
        progress.setCompletedAt(new Date());

        userLessonProcessRepository.save(progress);

        if (!wasLearned) {
            int currentPoint = userTraining.getPoint() != null ? userTraining.getPoint() : 0;
            userTraining.setPoint(currentPoint + lesson.getPoint());
        }

        updatePassingStatus(userTraining);
        userTrainingRepository.save(userTraining);
        return toLessonProgressDto(lesson, progress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getLessonDocumentsForCurrentUser(int lessonId) {
        Users currentUser = getCurrentUser();
        Lessons lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        boolean hasAccess = userTrainingRepository.findByUser_Id(currentUser.getId())
                .stream()
                .anyMatch(ut -> ut.getTraining().getId() == lesson.getTraining().getId());
        if (!hasAccess) {
            throw new AccessDeniedException("User does not have access to lesson documents");
        }
        return documentService.getDocumentsByLessonId(lessonId);
    }

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        String principal = authentication.getName();
        if (principal == null || principal.isBlank()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return usersRepository.findByEmail(principal)
                .or(() -> usersRepository.findByPhoneNumber(principal))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserTraining getUserTrainingForCurrentUser(int userTrainingId) {
        Users currentUser = getCurrentUser();
        UserTraining userTraining = userTrainingRepository.findById(userTrainingId)
                .orElseThrow(() -> new ResourceNotFoundException("User training not found"));
        if (userTraining.getUser().getId() != currentUser.getId()) {
            throw new AccessDeniedException("User training does not belong to current user");
        }
        return userTraining;
    }

    private Lessons verifyLessonBelongsToTraining(int lessonId, UserTraining userTraining) {
        Lessons lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        if (lesson.getTraining().getId() != userTraining.getTraining().getId()) {
            throw new AccessDeniedException("Lesson does not belong to training");
        }
        return lesson;
    }

    private LessonProgressDTO toLessonProgressDto(Lessons lesson, UserLessonProcess progress) {
        return LessonProgressDTO.builder()
                .lessonId(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .content(lesson.getContent())
                .point(lesson.getPoint())
                .orderIndex(lesson.getOrderIndex())
                .isLearned(progress != null && Boolean.TRUE.equals(progress.getIsLearned()))
                .startDate(progress != null ? progress.getStartDate() : null)
                .completedAt(progress != null ? progress.getCompletedAt() : null)
                .build();
    }

    private UserTrainingDTO toDtoWithStats(UserTraining userTraining) {
        Trainings training = userTraining.getTraining();
        int totalLessons = lessonRepository.countByTraining_Id(training.getId());
        int completedLessons = (int) userLessonProcessRepository
                .countByUserTraining_IdAndIsLearnedTrue(userTraining.getId());
        int trainingPoint = training.getPoint();
        int earnedPoints = userTraining.getPoint() != null ? userTraining.getPoint() : 0;
        double completionPercent = totalLessons == 0 ? 0.0 : (completedLessons * 100.0) / totalLessons;

        return UserTrainingDTO.builder()
                .id(userTraining.getId())
                .trainingId(training.getId())
                .trainingName(training.getName())
                .trainingPoint(trainingPoint)
                .userId(userTraining.getUser().getId())
                .userFullName(userTraining.getUser().getFullName())
                .userEmail(userTraining.getUser().getEmail())
                .userPhone(userTraining.getUser().getPhoneNumber())
                .point(earnedPoints)
                .isPassed(userTraining.getIsPassed())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .completionPercent(Math.round(completionPercent * 100.0) / 100.0)
                .status(determineStatus(userTraining, totalLessons, completedLessons))
                .enrolledAt(userTraining.getEnrolledAt())
                .completedAt(userTraining.getCompletedAt())
                .build();
    }

    private String determineStatus(UserTraining userTraining, int totalLessons, int completedLessons) {
        if (Boolean.TRUE.equals(userTraining.getIsPassed())) {
            return "COMPLETED";
        }
        return "IN_PROGRESS";
    }

    private void updatePassingStatus(UserTraining userTraining) {
        Trainings training = userTraining.getTraining();
        int trainingPoint = training.getPoint();
        int earnedPoints = userTraining.getPoint() != null ? userTraining.getPoint() : 0;
        int totalLessons = lessonRepository.countByTraining_Id(training.getId());
        int completedLessons = (int) userLessonProcessRepository
                .countByUserTraining_IdAndIsLearnedTrue(userTraining.getId());

        boolean completedAllLessons = totalLessons > 0 && completedLessons >= totalLessons;
        if (earnedPoints >= trainingPoint || completedAllLessons) {
            userTraining.setIsPassed(true);
            if (userTraining.getCompletedAt() == null) {
                userTraining.setCompletedAt(new Date());
            }
        }
    }

    private UserTrainingProgressDTO buildProgressDto(UserTraining userTraining) {
        int totalLessons = lessonRepository.countByTraining_Id(userTraining.getTraining().getId());
        int completedLessons = (int) userLessonProcessRepository
                .countByUserTraining_IdAndIsLearnedTrue(userTraining.getId());
        int trainingPoint = userTraining.getTraining().getPoint();
        int earnedPoints = userTraining.getPoint() != null ? userTraining.getPoint() : 0;
        double completionPercent = totalLessons == 0 ? 0.0 : (completedLessons * 100.0) / totalLessons;

        return UserTrainingProgressDTO.builder()
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .trainingPoint(trainingPoint)
                .earnedPoints(earnedPoints)
                .completionPercent(Math.round(completionPercent * 100.0) / 100.0)
                .isPassed(Boolean.TRUE.equals(userTraining.getIsPassed()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserManagementDTO> getAvailableUsersForTraining(int trainingId, Integer branchId) {
        Trainings training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found"));

        Integer requiredRoleId = training.getRole() != null ? training.getRole().getId() : null;
        if (requiredRoleId == null) {
            throw new IllegalArgumentException("Training does not have an assigned role");
        }

        List<Users> eligibleUsers = roleHistoryRepository.findActiveUsersByRoleAndBranch(
                requiredRoleId,
                branchId);

        Set<Integer> assignedUserIds = userTrainingRepository.findByTraining_Id(trainingId)
                .stream()
                .map(ut -> ut.getUser().getId())
                .collect(Collectors.toSet());

        List<Users> availableUsers = eligibleUsers.stream()
                .filter(user -> !assignedUserIds.contains(user.getId()))
                .filter(user -> user.getIsBan() == null || !user.getIsBan())
                .toList();

        return availableUsers.stream()
                .map(this::toUserManagementDTO)
                .toList();
    }

    private UserManagementDTO toUserManagementDTO(Users user) {
        UserManagementDTO dto = new UserManagementDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setNote(user.getNote());
        dto.setIsBan(user.getIsBan());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setMemberPoint(user.getMemberPoint());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setPhoneVerified(user.getPhoneVerified());
        dto.setIsBusy(user.getIsBusy());

        return dto;
    }
}
