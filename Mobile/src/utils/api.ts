import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, GOOGLE_API_KEY } from "./constant";

export const CustomersSignup = async (
  fullName: string,
  phoneNumber: string,
  password: string,
  dateOfBirth: string
) => {
  return axios.post(
    `${BASE_URL}/auth/customer/register`,
    {
      fullName,
      phoneNumber,
      password,
      dateOfBirth,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const SendOTP = async (channel: string, indentifier: string) => {
  return axios.post(
    `${BASE_URL}/auth/otp/send`,
    {
      channel,
      indentifier,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const TTLOtp = async (channel: string, identifier: string) => {
  return axios.get(
    `${BASE_URL}/auth/otp/ttl?channel=${channel}&identifier=${identifier}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const VeryfyOTP = async (
  channel: string,
  identifier: string,
  inputOtp: string
) => {
  return axios.post(
    `${BASE_URL}/auth/otp/verify`,
    {
      channel,
      identifier,
      inputOtp,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const VerifyOTPForForgotPassword = async (
  channel: string,
  identifier: string,
  inputOtp: string
) => {
  return axios.post(
    `${BASE_URL}/auth/otp/verify-otp-forgot-password`,
    {
      channel,
      identifier,
      inputOtp,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const LoginCustomers = async (phoneNumber: string, password: string) => {
  return axios.post(
    `${BASE_URL}/auth/customer/login`,
    {
      phoneNumber,
      password,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const ForgotPassword = async (phoneNumber: string) => {
  return axios.post(
    `${BASE_URL}/auth/customer/forgot-password`,
    {
      phoneNumber,
    },
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
};

export const ChangePassword = async (
  otp: string,
  phoneNumber: string,
  newPassword: string
) => {
  return axios.post(
    `${BASE_URL}/auth/customer/reset-password`,
    {
      otp,
      phoneNumber,
      newPassword,
    },
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
};

export const ReverseGeocodeGoogle = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_API_KEY,
          language: "vi",
        },
      }
    );

    if (response.data.status === "OK" && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      throw new Error(response.data.status || "Không tìm thấy địa chỉ");
    }
  } catch (error) {
    console.error("Google Geocoding API error:", error);
    throw error;
  }
};

export const geocodeAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_API_KEY,
          language: "vi",
        },
      }
    );

    if (
      response.data.status === "OK" &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }

    throw new Error(response.data.status || "Không thể xác định tọa độ");
  } catch (error) {
    console.error("Google Geocoding API error:", error);
    throw error;
  }
};

export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/directions/json`,
    {
      params: {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode: "driving",
        key: GOOGLE_API_KEY,
      },
    }
  );

  if (
    response.data.status === "OK" &&
    response.data.routes &&
    response.data.routes.length > 0
  ) {
    return response.data.routes[0].overview_polyline.points as string;
  }

  throw new Error(response.data.status || "Không lấy được dữ liệu tuyến đường");
};
export const GetBranchNearLocation = async (realLocation: string) => {
  return axios.get(
    `${BASE_URL}/branches/nearby?address=${realLocation}&limit=5`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const GetProductType = () => {
  return axios.get(`${BASE_URL}/product-types`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const GetProductByProductType = async (
  brandId: number,
  productTypeId: number
) => {
  return axios.get(
    `${BASE_URL}/products/search?branchId=${brandId}&productTypeId=${productTypeId}&isActive=true&minPrice=0&page=0&size=100&sortBy=name&sortDirection=ASC`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const GetAllProduct = async (branchId: number) => {
  return axios.get(
    `${BASE_URL}/products/search?branchId=${branchId}&isActive=true&minPrice=0&maxPrice=500000&page=0&size=100&sortBy=name&sortDirection=ASC`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const GetShippingFee = async (
  customerAddress: string,
  branchAddress: string
) => {
  return axios.get(
    `${BASE_URL}/orders/shipping/fee?customerAddress=${customerAddress}&branchAddress=${branchAddress}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const GetCustomerInformation = async (id: number) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/customers/${id}/informations`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const TopSellingProduct = async (branchId: number) => {
  return axios.get(
    `${BASE_URL}/statistics/top-selling?branchId=${branchId}&limit=5`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const AddNewCustomerInformation = async (
  id: number,
  payload: {
    name: string;
    address: string;
    phoneNumber: string;
    isDefault: boolean;
  }
) => {
  const token = await AsyncStorage.getItem("access_token");

  return axios.post(`${BASE_URL}/customers/${id}/informations`, payload, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const DeleteCustomerInformation = async (
  CusId: number,
  InforId: number
) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.delete(
    `${BASE_URL}/customers/${CusId}/informations/${InforId}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

export const GetBranchInfo = async (branchId: number) => {
  return axios.get(`${BASE_URL}/branches/${branchId}`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const CreateOrder = async (payload: {
  customerId: number;
  promotionCode: string;
  discountValue: number;
  shippingAddress: string;
  shippingPhoneNumber: string;
  orderItemList: {
    productId: number;
    comboId: number;
    quantity: number;
    price: number;
    note: string;
  }[];
  mode: string;
  diningTableId: number;
  branchId: number;
  paymentMethodId: number;
}) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.post(`${BASE_URL}/orders`, payload, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const GetCombo = async (branchId: number) => {
  return axios.get(
    `${BASE_URL}/combos/search?branchId=${branchId}&isActive=true&minPrice=0&maxPrice=1000000&page=0&size=100&sortBy=name&sortDirection=ASC`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const GetAllOrder = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/orders/customer/my-orders?status=ALL`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const GetDetailCustomerInformation = async (
  Cusid: number,
  InforId: number
) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/customers/${Cusid}/informations/${InforId}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const UpdateCustomerInformation = async (
  customerId: number,
  informationId: number,
  payload: {
    name: string;
    address: string;
    phoneNumber: string;
    isDefault: boolean;
  }
) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.put(
    `${BASE_URL}/customers/${customerId}/informations/${informationId}`,
    payload,
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

export const GetCustomerPromotion = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/promotions/customer/my-promotions`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const GetOrderById = async (orderId: number) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const GetAvailablePromotion = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(`${BASE_URL}/promotions/customer/available`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const SortProductByPrice = async (
  branchId: number,
  sortDirection: string
) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(
    `${BASE_URL}/products/search?branchId=${branchId}&isActive=true&minPrice=0&maxPrice=500000&page=0&size=100&sortBy=price&sortDirection=${sortDirection}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

export const SearchProductByName = async (branchId: number, name: string) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.get(
    `${BASE_URL}/products/search?branchId=${branchId}&keyword=${name}&isActive=true&minPrice=0&maxPrice=500000&page=0&size=100&sortBy=name&sortDirection=ASC`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

export const CompleteOrder = async (orderId: number) => {
  const token = await AsyncStorage.getItem("access_token");
  return axios.put(
    `${BASE_URL}/orders/customer/comleted/${orderId}`,
    {},
    {
      headers: {
        accept: "*/*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};
