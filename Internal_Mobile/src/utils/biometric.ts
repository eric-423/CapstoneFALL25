import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

export const isBiometricAvailable = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

export const supportsFingerprint = async () => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
  } catch (error) {
    console.error("Fingerprint support check error:", error);
    return false;
  }
};

export const authenticateWithBiometric = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Mở khóa bằng vân tay để đăng nhập",
      fallbackLabel: "Sử dụng mật khẩu",
      cancelLabel: "Huỷ",
      disableDeviceFallback: false,
      requireConfirmation: false,
    });

    if (result.success) {
      // Lưu trạng thái đã xác thực
      await AsyncStorage.setItem("biometric_authenticated", "true");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return false;
  }
};

export const checkBiometricAuth = async () => {
  try {
    const authenticated = await AsyncStorage.getItem("biometric_authenticated");
    return authenticated === "true";
  } catch (error) {
    console.error("Error checking biometric auth:", error);
    return false;
  }
};

export const clearBiometricAuth = async () => {
  try {
    await AsyncStorage.removeItem("biometric_authenticated");
  } catch (error) {
    console.error("Error clearing biometric auth:", error);
  }
};
