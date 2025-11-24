export interface GetTrainningsData {
  includeInactive?: boolean;
  roleId?: number;
  isActive?: boolean;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "DESC" | "ASC";
}

export interface TrainingResponse {
  status: number;
  desc: string;
  data: unknown;
}

export interface CreateTrainingPayload {
  name: string;
  note: string;
  point: number;
  isActive: boolean;
  roleId: number;
}

export type UpdateTrainingPayload = CreateTrainingPayload;

export interface TrainingLesson {
  id: number;
  title: string;
  content: string;
  description: string;
  point: number;
  orderIndex: number;
  trainingId: number;
  isActive: boolean;
}

export interface PaginatedLessonsResponse {
  content: TrainingLesson[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface TrainingLessonsResponse {
  status: number;
  desc: string | null;
  data: PaginatedLessonsResponse;
}

export interface LessonDetailResponse {
  status: number;
  desc: string | null;
  data: TrainingLesson;
}

export interface GetTrainingLessonsParams {
  includeDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface GetMyTrainingLessonsParams {
  includeDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface CreateLessonPayload {
  title: string;
  content: string;
  description: string;
  point: number;
  orderIndex: number;
  trainingId: number;
  isActive: boolean;
}

export type UpdateLessonPayload = CreateLessonPayload;

export interface LessonDocument {
  id: number;
  name: string;
  refLink: string;
  description: string;
  lessonId: number;
}

export interface LessonDocumentsResponse {
  status: number;
  desc: string | null;
  data: LessonDocument[];
}

export interface CreateDocumentPayload {
  name: string;
  refLink: string;
  description: string;
  lessonId: number;
}

export interface CreateDocumentResponse {
  status: number;
  desc: string | null;
  data: LessonDocument;
}

export const getTrainnings = async (
  data?: GetTrainningsData
): Promise<TrainingResponse> => {
  const params = new URLSearchParams();

  if (data) {
    if (data.includeInactive !== undefined) {
      params.append("includeInactive", data.includeInactive.toString());
    }
    if (data.roleId !== undefined) {
      params.append("roleId", data.roleId.toString());
    }
    if (data.isActive !== undefined) {
      params.append("isActive", data.isActive.toString());
    }
    if (data.keyword) {
      params.append("keyword", data.keyword);
    }
    if (data.page !== undefined) {
      params.append("page", data.page.toString());
    }
    if (data.size !== undefined) {
      params.append("size", data.size.toString());
    }
    if (data.sortBy) {
      params.append("sortBy", data.sortBy);
    }
    if (data.sortDirection) {
      params.append("sortDirection", data.sortDirection);
    }
  }

  const queryString = params.toString();
  const url = `/api/trainning${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const getTrainningById = async (traningId: number) => {
  const url = `/api/trainning/${traningId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export type MyTrainingStatus =
  | "ALL"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export const getMyTrainning = async (status?: MyTrainingStatus) => {
  const params = new URLSearchParams();
  if (status && status !== "ALL") {
    params.append("status", status);
  }
  const queryString = params.toString();
  const url = `/api/trainning/me${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }
  return response.json();
};

export const createTraining = async (
  payload: CreateTrainingPayload
): Promise<TrainingResponse> => {
  const response = await fetch("/api/trainning", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const deleteTraining = async (trainingId: number) => {
  const url = `/api/trainning/${trainingId}`;

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data: payload,
        status: response.status,
      },
    };
  }

  return payload;
};

export const updateTraining = async (
  trainingId: number,
  payload: UpdateTrainingPayload
): Promise<TrainingResponse> => {
  const response = await fetch(`/api/trainning/${trainingId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const getTrainingLessons = async (
  trainingId: number,
  params?: GetTrainingLessonsParams
): Promise<TrainingLessonsResponse> => {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.includeDeleted !== undefined) {
      searchParams.append("includeDeleted", params.includeDeleted.toString());
    }
    if (params.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }
    if (params.size !== undefined) {
      searchParams.append("size", params.size.toString());
    }
    if (params.sortBy) {
      searchParams.append("sortBy", params.sortBy);
    }
    if (params.sortDirection) {
      searchParams.append("sortDirection", params.sortDirection);
    }
  }

  const queryString = searchParams.toString();

  const response = await fetch(
    `/api/trainning/${trainingId}/lessons${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const getMyTrainingLessons = async (
  trainingId: number,
  params?: GetMyTrainingLessonsParams
): Promise<TrainingLessonsResponse> => {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.includeDeleted !== undefined) {
      searchParams.append("includeDeleted", params.includeDeleted.toString());
    }
    if (params.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }
    if (params.size !== undefined) {
      searchParams.append("size", params.size.toString());
    }
    if (params.sortBy) {
      searchParams.append("sortBy", params.sortBy);
    }
    if (params.sortDirection) {
      searchParams.append("sortDirection", params.sortDirection);
    }
  }

  const queryString = searchParams.toString();

  const response = await fetch(
    `/api/lessons/me/trainings/${trainingId}/lessons${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const getLessonDetail = async (
  lessonId: number
): Promise<LessonDetailResponse> => {
  const response = await fetch(`/api/lessons/${lessonId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};

export const createLesson = async (
  trainingId: number,
  payload: CreateLessonPayload
): Promise<LessonDetailResponse> => {
  const response = await fetch(`/api/trainning/${trainingId}/lessons`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const updateLesson = async (
  lessonId: number,
  payload: UpdateLessonPayload
): Promise<LessonDetailResponse> => {
  const response = await fetch(`/api/lessons/${lessonId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const getLessonDocuments = async (
  lessonId: number
): Promise<LessonDocumentsResponse> => {
  const response = await fetch(`/api/documents/admin/lessons/${lessonId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const getMyLessonDocuments = async (
  lessonId: number
): Promise<LessonDocumentsResponse> => {
  const response = await fetch(
    `/api/user-trainings/me/lessons/${lessonId}/documents`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const createLessonDocument = async (
  lessonId: number,
  payload: CreateDocumentPayload
): Promise<CreateDocumentResponse> => {
  const response = await fetch(`/api/documents/admin/lessons/${lessonId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const updateLessonDocument = async (
  documentId: number,
  payload: CreateDocumentPayload
): Promise<CreateDocumentResponse> => {
  const response = await fetch(`/api/documents/admin/${documentId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const deleteLessonDocument = async (
  documentId: number
): Promise<{ status: number; desc: string; data: null }> => {
  const response = await fetch(`/api/documents/admin/${documentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      response: {
        data,
        status: response.status,
      },
    };
  }

  return data;
};

export const AssignUserToTraining = async (
  trainingId: number,
  userIds: number[],
  branchId: number,
  roleId: number
): Promise<{ status: number; desc: string; data: null }> => {
  const response = await fetch(`/api/training-user/${trainingId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds, branchId, roleId }),
  });

  const data = await response.json().catch(() => ({}));
  return data;
};

export interface GetUsersByRoleRequest {
  role?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  keyword?: string;
  branchId?: number;
  status?: boolean;
}

export interface GetUsersByRoleResponse {
  status: number;
  desc: string;
  data: {
    content: Array<{
      id: number;
      fullName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      createdAt: string;
      branchId: number;
      role: string;
      [key: string]: unknown;
    }>;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
  };
}

export interface TrainingUserItem {
  id: number;
  trainingId: number;
  trainingName: string;
  trainingPoint: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  point: number;
  isPassed: boolean;
  totalLessons: number;
  completedLessons: number;
  completionPercent: number;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
}

export interface EnrollCourseResponse {
  status: number;
  desc: string;
  data: TrainingUserItem;
}

export interface GetTrainingUsersResponse {
  status: number;
  desc: string;
  data: TrainingUserItem[];
}

export const getTrainingUsers = async (
  trainingId: number
): Promise<GetTrainingUsersResponse> => {
  const response = await fetch(`/api/training-user/${trainingId}/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to fetch training users" }));
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return {
      status: 200,
      desc: "Success",
      data: data,
    };
  }

  if (data?.data && Array.isArray(data.data)) {
    return {
      status: data.status || 200,
      desc: data.desc || "Success",
      data: data.data,
    };
  }
  return {
    status: data.status || 200,
    desc: data.desc || "Success",
    data: [],
  };
};

export const getAvailableUsersForTraining = async (
  trainingId: number
): Promise<GetUsersByRoleResponse> => {
  const response = await fetch(`/api/trainning/${trainingId}/available-users`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Failed to fetch available users" }));
    throw {
      response: {
        data: errorData,
        status: response.status,
      },
    };
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return {
      status: 200,
      desc: "Success",
      data: {
        content: data,
        pageNumber: 0,
        pageSize: data.length,
        totalElements: data.length,
        totalPages: 1,
        last: true,
        first: true,
        empty: data.length === 0,
      },
    };
  }
  if (data?.data?.content && Array.isArray(data.data.content)) {
    return data;
  }

  if (data?.data && Array.isArray(data.data)) {
    return {
      status: data.status || 200,
      desc: data.desc || "Success",
      data: {
        content: data.data,
        pageNumber: 0,
        pageSize: data.data.length,
        totalElements: data.data.length,
        totalPages: 1,
        last: true,
        first: true,
        empty: data.data.length === 0,
      },
    };
  }
  return {
    status: data.status || 200,
    desc: data.desc || "Success",
    data: {
      content: [],
      pageNumber: 0,
      pageSize: 0,
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
      empty: true,
    },
  };
};

export const enrollCourse = async (
  trainingId: number
): Promise<EnrollCourseResponse> => {
  const response = await fetch(`/api/trainning/${trainingId}/enrrol-course`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorBody,
        status: response.status,
      },
    };
  }

  return response.json();
};
