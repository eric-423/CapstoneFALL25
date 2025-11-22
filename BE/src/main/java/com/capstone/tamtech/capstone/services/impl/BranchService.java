package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.BranchDTO;
import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.dto.BranchProductDTO;
import com.capstone.tamtech.capstone.dto.BranchStatisticsDTO;
import com.capstone.tamtech.capstone.payload.request.AddProductsToBranchRequest;
import com.capstone.tamtech.capstone.payload.request.BranchRequest;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface BranchService {

    List<BranchDistanceDTO> findBranchesSortedByDistance(String userAddress, Integer limit);

    List<BranchDTO> getAllBranches();

    Boolean deactivateBranch(int branchId) throws BadRequestException;

    Boolean activateBranch(int branchId) throws BadRequestException;

    BranchDTO createBranch(BranchRequest branchRequest);

    BranchDTO updateBranch(int branchId, BranchRequest branchRequest);

    BranchDTO getBranchById(int branchId);

    List<BranchProductDTO> addProductsToBranch(int branchId, AddProductsToBranchRequest request);

    BranchStatisticsDTO getBranchStatistics();
}
