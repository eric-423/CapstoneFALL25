package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.BranchDTO;
import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.payload.request.BranchRequest;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface BranchService {

    /**
     * Trả về danh sách chi nhánh được sắp xếp theo khoảng cách từ địa chỉ người dùng (gần -> xa).
     * @param userAddress địa chỉ người dùng (bắt buộc)
     * @param limit số lượng kết quả tối đa (có thể null)
     */
    List<BranchDistanceDTO> findBranchesSortedByDistance(String userAddress, Integer limit);

    List<BranchDTO> getAllBranches();

    Boolean deactivateBranch(int branchId) throws BadRequestException;

    Boolean activateBranch(int branchId) throws BadRequestException;

    BranchDTO createBranch(BranchRequest branchRequest);

    BranchDTO updateBranch(int branchId, BranchRequest branchRequest);

    BranchDTO getBranchById(int branchId);
}


