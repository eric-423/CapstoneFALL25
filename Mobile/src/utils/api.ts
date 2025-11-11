import axios from "axios";
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
        accept: "application/json",
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
  return axios.post(`${BASE_URL}/auth/customer/reset-password`, {
    otp,
    phoneNumber,
    newPassword,
  });
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
