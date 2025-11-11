import axios from "axios";
import { BASE_URL } from "./constant";

export const CustomersSignupAPI = async (
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

export const TTLOtpAPI = async (channel: string, identifier: string) => {
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

export const ForgotPasswordAPI = async (phoneNumber: string) => {
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

export const ChangePasswordAPI = async (
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
