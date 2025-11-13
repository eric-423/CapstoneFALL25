package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.BranchDTO;
import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.BranchRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.services.impl.BranchService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class BranchServiceImpl implements BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private DistanceService distanceService;

    @Override
    public List<BranchDistanceDTO> findBranchesSortedByDistance(String userAddress, Integer limit) {
        List<Branch> branches = branchRepository.findByIsActiveTrue();

        List<BranchDistanceDTO> results = new ArrayList<>();
        for (Branch branch : branches) {
            String branchAddress = branch.getAddress();
            long meters = distanceService.getDistanceInMeters(branchAddress, userAddress);
            if (meters < 0) {
                meters = Long.MAX_VALUE;
            }

            BranchDistanceDTO dto = BranchDistanceDTO.builder()
                    .branchId(branch.getId())
                    .name(branch.getName())
                    .address(branch.getAddress())
                    .phoneNumber(branch.getPhoneNumber())
                    .isParent(branch.getIsParent())
                    .distanceInMeters(meters)
                    .distanceText(formatDistance(meters))
                    .build();
            results.add(dto);
        }

        results.sort(Comparator.comparingLong(BranchDistanceDTO::getDistanceInMeters));

        if (limit != null && limit > 0 && limit < results.size()) {
            return new ArrayList<>(results.subList(0, limit));
        }

        return results;
    }

    private BranchDTO toDTO(Branch branch){
        BranchDTO dto = new BranchDTO();
        dto.setId(branch.getId());
        dto.setName(branch.getName());
        dto.setAddress(branch.getAddress());
        dto.setPhone(branch.getPhoneNumber());
        dto.setParent(branch.getIsParent());
        dto.setActive(branch.getIsActive());
        return dto;
    }

    @Override
    public List<BranchDTO> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();
        return branches.stream().map(this::toDTO).toList();
    }

    @Override
    public Boolean deactivateBranch(int branchId) throws BadRequestException {
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        if(branch.getIsParent()){
            throw new BadRequestException("Cannot deactivate parent branch");
        } else if(!branch.getIsActive()){
            throw new BadRequestException("Branch is already deactivated");
        } else{
            branch.setIsActive(false);
            branchRepository.save(branch);
            return true;
        }
    }

    @Override
    public Boolean activateBranch(int branchId) throws BadRequestException {
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        if(branch.getIsParent()){
            throw new BadRequestException("Cannot active parent branch");
        } else if(!branch.getIsActive()) {
            throw new BadRequestException("Branch is already activated");
        } else {
            branch.setIsActive(true);
            branchRepository.save(branch);
            return true;
        }
    }

    @Override
    public BranchDTO createBranch(BranchRequest branchRequest) {
        Branch branch = new Branch();
        branch.setName(branchRequest.getName());
        branch.setAddress(branchRequest.getAddress());
        branch.setPhoneNumber(branchRequest.getPhoneNumber());
        branch.setIsParent(false);
        branch.setIsActive(true);

        Branch savedBranch = branchRepository.save(branch);
        return toDTO(savedBranch);
    }

    @Override
    public BranchDTO updateBranch(int branchId, BranchRequest branchRequest) {

        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        branch.setName(branchRequest.getName());
        branch.setAddress(branchRequest.getAddress());
        branch.setPhoneNumber(branchRequest.getPhoneNumber());

        Branch updatedBranch = branchRepository.save(branch);
        return toDTO(updatedBranch);
    }

    @Override
    public BranchDTO getBranchById(int branchId) {
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        return toDTO(branch);
    }

    private String formatDistance(long meters) {
        if (meters == Long.MAX_VALUE) {
            return "N/A";
        }
        if (meters < 1000) {
            return meters + " m";
        }
        double km = meters / 1000.0;
        return String.format(java.util.Locale.US, "%.2f km", km);
    }
}


