package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.services.impl.BranchService;
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
        List<Branch> branches = branchRepository.findAll();

        List<BranchDistanceDTO> results = new ArrayList<>();
        for (Branch branch : branches) {
            String branchAddress = branch.getAddress();
            long meters = distanceService.getDistanceInMeters(branchAddress, userAddress);
            if (meters < 0) {
                meters = Long.MAX_VALUE; // đẩy xuống cuối danh sách nếu không tính được
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


