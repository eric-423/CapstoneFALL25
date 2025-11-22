package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchStatisticsDTO {
    private int totalBranches;
    private int activeBranches;
    private int inactiveBranches;
    private int parentBranches;
    private List<BranchStatusDTO> branches;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchStatusDTO {
        private int id;
        private String name;
        private String address;
        private String phoneNumber;
        private Boolean isActive;
        private Boolean isParent;
    }
}
