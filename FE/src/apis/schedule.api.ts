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
  data: Schedule[];
}

export interface CreateScheduleData {
  userId: number;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleData {
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}


export const getSchedules = async (): Promise<ScheduleResponse> => {
  const response = await fetch('/api/schedules', {
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
    throw new Error(errorData.desc || 'Failed to create schedule');
  }

  return response.json();
};

/**
 * Cập nhật lịch trình
 */
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.desc || 'Failed to update schedule');
  }

  return response.json();
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

