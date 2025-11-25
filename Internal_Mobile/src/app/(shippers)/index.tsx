import ShareButton from "@/components/btnComponent/shareBtn";
import OrderCard from "@/components/cardStaff/orderConfirmCard";
import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import {
  authenticateWithBiometric,
  checkBiometricAuth,
  supportsFingerprint,
} from "@/utils/biometric";
import * as Application from "expo-application";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

const ShippingOrder = () => {
  const { appState } = useCurrentApp();

  const handleQuickLogin = useCallback(async () => {
    try {
      const token = appState?.token;
      if (!token) {
        Alert.alert(
          "Đăng nhập quá hạn",
          "Hãy đăng nhập lại để tiếp tục sử dụng."
        );
        return;
      }
      const hasFingerprint = await supportsFingerprint();
      if (!hasFingerprint) {
        Alert.alert(
          "Thiết bị không hỗ trợ",
          "Thiết bị của bạn chưa bật vân tay."
        );
        return;
      }
      const isBiometricAuth = await checkBiometricAuth();
      if (!isBiometricAuth) {
        const enabled = await authenticateWithBiometric();
        if (enabled) {
          Alert.alert(
            "Đã bật vân tay",
            "Lần sau bạn có thể dùng nút này để vào nhanh."
          );
        } else {
          Alert.alert(
            "Chưa kích hoạt",
            "Không thể bật vân tay. Vui lòng thử lại."
          );
        }
        return;
      }

      const authenticated = await authenticateWithBiometric();
      if (authenticated) {
        try {
          const androidId =
            Platform.OS === "android" &&
            typeof Application.getAndroidId === "function"
              ? Application.getAndroidId()
              : null;
          const installReferrer =
            Platform.OS === "android" &&
            typeof Application.getInstallReferrerAsync === "function"
              ? await Application.getInstallReferrerAsync()
              : null;
          console.log("Device androidId:", androidId ?? "Không khả dụng");
          console.log("Install referrer:", installReferrer ?? "Không khả dụng");
        } catch (infoError) {
          console.error("Không lấy được thông tin thiết bị:", infoError);
        }
        router.replace("/(shippers)");
      } else {
        Alert.alert(
          "Xác thực thất bại",
          "Vân tay không khớp. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Lỗi đăng nhập vân tay:", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StaffHeader
        staffName={appState?.userInfo.fullName}
        staffCounter={appState?.userInfo.address}
      />

      <OrderCard isShipper={true} />
      <View style={styles.quickLoginWrapper}>
        <ShareButton
          title=" "
          onPress={handleQuickLogin}
          btnStyle={styles.quickLoginBtn}
          pressStyle={{ alignSelf: "center" }}
        />
        <Text style={styles.quickLoginText}>Chấm công</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  quickLoginWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  quickLoginBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  quickLoginText: {
    fontSize: 16,
    fontFamily: APP_FONT.BOLD,
    color: APP_COLOR.BROWN,
  },
});
export default ShippingOrder;
