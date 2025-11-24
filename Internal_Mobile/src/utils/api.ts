import axios from "axios";
import { BASE_URL } from "./constant";

export const LoginShipper = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth/employee/login`, {
    email,
    password,
  });
  return response.data;
};

export const getShippingOrders = async (token: string) => {
  const response = await axios.get(
    `${BASE_URL}/orders/branch/my-branch?status=SHIPPING`,
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
