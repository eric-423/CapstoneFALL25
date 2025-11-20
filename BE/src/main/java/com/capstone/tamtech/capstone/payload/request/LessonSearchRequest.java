package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LessonSearchRequest {
    private Boolean includeDeleted = false;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "orderIndex";

    private String sortDirection = "ASC";
}
