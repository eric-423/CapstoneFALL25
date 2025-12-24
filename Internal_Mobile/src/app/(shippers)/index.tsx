import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import {
  checkAttendanceStatus,
  checkInAttendance,
  checkOutAttendance,
} from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

const AttendanceScreen = () => {
  const { appState } = useCurrentApp();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workTime, setWorkTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [displayCheckInTime, setDisplayCheckInTime] = useState<string | null>(
    null
  );
  const [displayCheckOutTime, setDisplayCheckOutTime] = useState<string | null>(
    null
  );
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    checkAttendanceStatusOnMount();
  }, []);

  const checkAttendanceStatusOnMount = async () => {
    if (!appState?.token || !appState?.userInfo?.id) {
      setInitialLoading(false);
      return;
    }

    try {
      const userId = parseInt(appState.userInfo.id, 10);
      const response = await checkAttendanceStatus(appState.token, userId);

      if (response?.status === 0 && response?.data) {
        const attendanceData = response.data;

        if (attendanceData.checkIn && !attendanceData.checkOut) {
          setIsCheckedIn(true);
          const checkInDate = new Date(attendanceData.checkIn);
          setCheckInTime(checkInDate);
          setDisplayCheckInTime(formatDateTime(checkInDate));
          setDisplayCheckOutTime(null);
          setCheckOutTime(null);

          const now = new Date();
          const diff = Math.floor(
            (now.getTime() - checkInDate.getTime()) / 1000
          );
          setWorkTime(diff);
        } else if (attendanceData.checkIn && attendanceData.checkOut) {
          setIsCheckedOut(true);
          setIsCheckedIn(true);

          const checkInDate = new Date(attendanceData.checkIn);
          const checkOutDate = new Date(attendanceData.checkOut);
          setCheckInTime(checkInDate);
          setCheckOutTime(checkOutDate);
          setDisplayCheckInTime(formatDateTime(checkInDate));
          setDisplayCheckOutTime(formatDateTime(checkOutDate));

          const diff = Math.floor(
            (checkOutDate.getTime() - checkInDate.getTime()) / 1000
          );
          setWorkTime(diff);
        }
      }
    } catch (error) {
      console.error("Error checking attendance status:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isCheckedIn && !isCheckedOut && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
        setWorkTime(diff);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCheckedIn, isCheckedOut, checkInTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          setIsCheckedIn(true);
          setIsCheckedOut(true);
          const now = new Date();
          setCheckOutTime(now);
          setDisplayCheckOutTime(formatDateTime(now));
          Toast.show(response.desc || "Kết thúc ca làm thành công", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
          checkAttendanceStatusOnMount();
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
          setIsCheckedOut(false);
          const now = new Date();
          setCheckInTime(now);
          setDisplayCheckInTime(formatDateTime(now));
          setDisplayCheckOutTime(null);
          setCheckOutTime(null);
          setWorkTime(0);
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
        {(displayCheckInTime || displayCheckOutTime) && (
          <View style={styles.infoContainer}>
            {displayCheckInTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Check-in:</Text>
                <Text style={styles.infoValue}>{displayCheckInTime}</Text>
              </View>
            )}
            {displayCheckOutTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Check-out:</Text>
                <Text style={styles.infoValue}>{displayCheckOutTime}</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Thời gian làm việc</Text>
          <Text style={styles.timerValue}>{formatTime(workTime)}</Text>
        </View>
        <Pressable
          style={[
            styles.checkInButton,
            isCheckedIn && !isCheckedOut && styles.checkOutButton,
            isCheckedOut && styles.checkedOutButton,
            (loading || initialLoading) && styles.disabledButton,
          ]}
          onPress={handleCheckIn}
          disabled={loading || isCheckedOut || initialLoading}
        >
          <AntDesign
            name={isCheckedIn ? "closecircle" : "checkcircle"}
            size={64}
            color={APP_COLOR.WHITE}
          />
          {!loading && !initialLoading && (
            <Text style={styles.checkInText}>
              {isCheckedOut
                ? "Đã chấm công"
                : isCheckedIn
                ? "Kết thúc ca làm"
                : "Bắt đầu ca làm"}
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  checkInButton: {
    backgroundColor: APP_COLOR.ORANGE,
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
  infoContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 12,
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  infoValue: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  timerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  timerLabel: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 8,
  },
  timerValue: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 32,
    color: APP_COLOR.ORANGE,
    letterSpacing: 2,
  },
  checkedOutButton: {
    backgroundColor: "#666666",
    opacity: 0.7,
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
