// Role API functions

export interface Role {
  id: number;
  name: string;
  isInternal: boolean;
}

export interface RolesResponse {
  status: number;
  desc: string | null;
  data: Role[];
}

export interface RoleResponse {
  status: number;
  desc: string | null;
  data: Role;
}

export interface CreateRoleRequest {
  name: string;
  internal: boolean;
}

export interface UpdateRoleRequest {
  name: string;
  internal: boolean;
}

export async function getRoles() {
  const response = await fetch("/api/roles", {
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

  const result = await response.json();
  return result.data as Role[];
}

/**
 * Tạo role mới
 */
export async function createRole(data: CreateRoleRequest) {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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

  const result = await response.json();
  return result.data as Role;
}

/**
 * Cập nhật role
 */
export async function updateRole(roleId: number, data: UpdateRoleRequest) {
  const response = await fetch(`/api/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
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

  const result = await response.json();
  return result.data as Role;
}
