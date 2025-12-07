export interface Schedule {
  id: number;
  userId: number;
  userName: string;
  name: string;
  description: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface ScheduleResponse {
  status: number;
  desc: string;
  data: Schedule[] | Schedule;
}

export interface CreateScheduleData {
  userId: number;
  name: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  shiftId?: number;
}

export interface UpdateScheduleData {
  userId?: number;
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  shiftId?: number;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  branchId: number;
  description?: string;
  isActive?: boolean;
}

export interface CreateShiftData {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  branchId: number;
  isActive: boolean;
}

export interface UpdateShiftData {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface ShiftResponse {
  status: number;
  desc: string;
  data: Shift[];
}

export const getShifts = async (branchId?: number): Promise<ShiftResponse> => {
  const url = branchId && branchId > 0
    ? `/api/shifts?branchId=${branchId}`
    : '/api/shifts';

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('Failed to fetch shifts');
    throw new Error('Failed to fetch shifts');
  }

  return response.json();
};

export const createShift = async (data: CreateShiftData): Promise<ShiftResponse> => {
  const response = await fetch('/api/shifts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.desc || errorData.error || 'Failed to create shift');
  }

  return response.json();
};

export const updateShift = async (shiftId: number, data: UpdateShiftData): Promise<ShiftResponse> => {
  const response = await fetch(`/api/shifts/${shiftId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.desc || errorData.error || 'Failed to update shift');
  }

  return response.json();
};


export const getSchedules = async (branchId?: number): Promise<ScheduleResponse> => {
  const url = branchId && branchId > 0
    ? `/api/schedules?branchId=${branchId}`
    : '/api/schedules';

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('Failed to fetch schedules');
  }

  return response.json();
};


export const createSchedule = async (
  data: CreateScheduleData
): Promise<ScheduleResponse> => {
  const response = await fetch('/api/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.desc || errorData.error || 'Failed to create schedule';
    console.log(errorMessage);
    // Return empty response instead of throwing
    return { status: response.status, desc: errorMessage, data: [] };
  }

  return response.json();
};



export const updateSchedule = async (
  scheduleId: number,
  data: UpdateScheduleData
): Promise<ScheduleResponse> => {
  const response = await fetch(`/api/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const responseText = await response.text();
  let errorData: { message?: string; desc?: string; error?: string } = {};

  try {
    errorData = JSON.parse(responseText);
  } catch {
    errorData = { message: responseText || 'Unknown error' };
  }

  if (!response.ok) {
    console.error('Update schedule error:', {
      status: response.status,
      statusText: response.statusText,
      errorData,
      payload: data
    });
    throw new Error(
      errorData.desc ||
      errorData.message ||
      errorData.error ||
      `Failed to update schedule: ${response.status} ${response.statusText}`
    );
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { status: 200, desc: 'Success', data: [] };
  }
};

/**
 * Xóa lịch trình
 */
export const deleteSchedule = async (
  scheduleId: number
): Promise<{ status: number; desc: string }> => {
  const response = await fetch(`/api/schedules/${scheduleId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.desc || 'Failed to delete schedule');
  }

  return response.json();
};

