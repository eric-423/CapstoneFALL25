import axios from "axios";
import { BASE_URL } from "./constant";

export const LoginShipper = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/employee/login`, {
    email,
    password,
  });

  const userInfo = response.data?.userInfo;
  const role = userInfo?.role;

  if (role === "ADMIN" || role === "MANAGER") {
    const error = new Error("Ứng dụng không khả dụng với vai trò này");
    (error as any).response = {
      data: {
        message: "Ứng dụng không khả dụng với vai trò này",
      },
      status: 403,
    };
    throw error;
  }

  return response.data;
};

export const getShippingOrders = async (token: string) => {
  const response = await axios.get(
    `${BASE_URL}/orders/shipper/optimized-route`,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const sendShipperLocation = async (
  token: string,
  locationUpdate: {
    orderId: number;
    latitude: number;
    longitude: number;
  }
) => {
  const payload = {
    orderId: Number(locationUpdate.orderId),
    latitude: Number(locationUpdate.latitude),
    longitude: Number(locationUpdate.longitude),
  };
  if (
    isNaN(payload.orderId) ||
    isNaN(payload.latitude) ||
    isNaN(payload.longitude)
  ) {
    throw new Error("Invalid location data: all values must be numbers");
  }

  const response = await axios.post(
    `${BASE_URL}/shipper/orders/${payload.orderId}/location`,
    payload,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getShipperLocation = async (token: string, orderId: number) => {
  const response = await axios.get(
    `${BASE_URL}/orders/${orderId}/shipper-location`,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const confirmOrder = async (token: string, orderId: number) => {
  const response = await axios.put(
    `${BASE_URL}/orders/shipper/delivered/${orderId}`,
    {},
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const startDelivery = async (token: string) => {
  const response = await axios.put(
    `${BASE_URL}/orders/shipper/start-delivery`,
    {},
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const readyPickup = async (token: string) => {
  const response = await axios.put(
    `${BASE_URL}/orders/shipper/ready-pickup`,
    {},
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const buildAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const SendOTP = async (
  channel: string,
  indentifier: string,
  token?: string
) => {
  return axios.post(
    `${BASE_URL}/auth/otp/send`,
    {
      channel,
      indentifier,
    },
    {
      headers: buildAuthHeaders(token),
    }
  );
};

export const TTLOtp = async (
  channel: string,
  identifier: string,
  token?: string
) => {
  return axios.get(
    `${BASE_URL}/auth/otp/ttl?channel=${channel}&identifier=${identifier}`,
    {
      headers: buildAuthHeaders(token),
    }
  );
};

export const VeryfyOTP = async (
  channel: string,
  identifier: string,
  inputOtp: string,
  token?: string
) => {
  return axios.post(
    `${BASE_URL}/auth/otp/verify`,
    {
      channel,
      identifier,
      inputOtp,
    },
    {
      headers: buildAuthHeaders(token),
    }
  );
};

export const checkInAttendance = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/attendance/check-in`,
    {},
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const checkOutAttendance = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/attendance/check-out`,
    {},
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getChatMessages = async (token: string, orderId: number) => {
  const response = await axios.get(
    `${BASE_URL}/orders/${orderId}/chat-messages`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const checkAttendanceStatus = async (token: string, userId: number) => {
  const response = await axios.get(
    `${BASE_URL}/attendance/check?userId=${userId}`,
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
