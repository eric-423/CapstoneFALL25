import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { checkInAttendance, checkOutAttendance } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

const AttendanceScreen = () => {
  const { appState } = useCurrentApp();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập vị trí",
          "Ứng dụng cần quyền truy cập vị trí để chấm công",
          [{ text: "OK" }]
        );
        return;
      }
    } catch (err) {
      console.error("Error getting location permission:", err);
    }
  };

  const handleCheckIn = async () => {
    if (!appState?.token) {
      Toast.show("Vui lòng đăng nhập lại", {
        duration: Toast.durations.SHORT,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
      return;
    }

    setLoading(true);
    try {
      if (isCheckedIn) {
        const response = await checkOutAttendance(appState.token);
        if (response?.status === 0) {
          setIsCheckedIn(false);
          Toast.show(response.desc || "Kết thúc ca làm thành công", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
        } else {
          Toast.show(response?.desc || "Kết thúc ca làm thất bại", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.CANCEL,
            opacity: 1,
          });
        }
      } else {
        const response = await checkInAttendance(appState.token);
        if (response?.status === 0 && response?.data) {
          setIsCheckedIn(true);
          Toast.show(response.desc || "Check-in thành công", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
        } else {
          Toast.show(response?.desc || "Check-in thất bại", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.CANCEL,
            opacity: 1,
          });
        }
      }
    } catch (error: any) {
      let errorMessage = `Không thể ${
        isCheckedIn ? "kết thúc" : "bắt đầu"
      } ca làm. Vui lòng thử lại.`;

      if (error?.response?.status === 400) {
        errorMessage =
          error?.response?.data?.desc ||
          error?.response?.data?.message ||
          "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (error?.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này.";
      } else if (error?.response?.data?.desc) {
        errorMessage = error.response.data.desc;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Toast.show(errorMessage, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StaffHeader
        staffName={appState?.userInfo.fullName}
        staffCounter={appState?.userInfo.address}
      />
      <View style={styles.content}>
        <Pressable
          style={[
            styles.checkInButton,
            isCheckedIn && styles.checkOutButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleCheckIn}
          disabled={loading}
        >
          <AntDesign
            name={isCheckedIn ? "closecircle" : "checkcircle"}
            size={64}
            color={APP_COLOR.WHITE}
          />
          {!loading && (
            <Text style={styles.checkInText}>
              {isCheckedIn ? "Kết thúc ca làm" : "Bắt đầu ca làm"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInButton: {
    backgroundColor: "#1A3F22",
    borderRadius: 100,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  checkOutButton: {
    backgroundColor: APP_COLOR.CANCEL,
  },
  disabledButton: {
    opacity: 0.6,
  },
  checkInText: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 16,
    color: APP_COLOR.WHITE,
    marginTop: 12,
    textAlign: "center",
  },
});

export default AttendanceScreen;
