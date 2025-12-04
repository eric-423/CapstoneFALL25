import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { checkInAttendance, checkOutAttendance } from "@/utils/api";
import { GOOGLE_API_KEY } from "@/utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Toast from "react-native-root-toast";

interface LocationData {
  latitude: number;
  longitude: number;
}

const AttendanceScreen = () => {
  const [activeTab, setActiveTab] = useState<"today" | "list">("today");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<string>("Đang tải địa chỉ...");
  const [loading, setLoading] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Quyền truy cập vị trí bị từ chối");
        Alert.alert(
          "Quyền truy cập vị trí",
          "Ứng dụng cần quyền truy cập vị trí để chấm công",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(newLocation);
      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      await reverseGeocode(newLocation.latitude, newLocation.longitude);
      setLoading(false);
    } catch (err) {
      setAddress("Không thể lấy vị trí");
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=vi`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Không thể lấy địa chỉ");
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress("Không thể lấy địa chỉ");
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

    try {
      if (isCheckedIn) {
        const response = await checkOutAttendance(appState.token);
        if (response?.status === 0) {
          setCheckInTime(null);
          setCheckInDate(null);
          setAttendanceData(null);
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
        // Check-in
        const response = await checkInAttendance(appState.token);
        if (response?.status === 0 && response?.data) {
          const checkInDateTime = new Date(response.data.checkIn);
          const timeString = checkInDateTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          setCheckInTime(timeString);
          setCheckInDate(response.data.workDate);
          setAttendanceData(response.data);
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
      console.error("Error:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

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
    }
  };

  const formatDate = (date: Date) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return `${date.getDate()} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatTimeDisplay = (timeString: string) => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    return { hours, minutes, seconds, period };
  };

  const displayTime = checkInTime || formatTime(currentTime);
  const timeParts = formatTimeDisplay(displayTime);
  const { appState } = useCurrentApp();

  return (
    <View style={styles.container}>
      <StaffHeader
        staffName={appState?.userInfo.fullName}
        staffCounter={appState?.userInfo.address}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "today" && styles.activeTab]}
            onPress={() => setActiveTab("today")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "today" && styles.activeTabText,
              ]}
            >
              Chấm công hôm nay
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "list" && styles.activeTab]}
            onPress={() => setActiveTab("list")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "list" && styles.activeTabText,
              ]}
            >
              Danh sách chấm công
            </Text>
          </Pressable>
        </View>

        {activeTab === "today" ? (
          <View style={styles.contentCard}>
            <Text style={styles.dateText}>
              {checkInDate
                ? `Ngày check-in: ${checkInDate}`
                : formatDate(currentTime)}
            </Text>
            {checkInTime && (
              <Text style={styles.checkInTimeText}>
                Thời gian check-in: {checkInTime}
              </Text>
            )}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Thời gian bắt đầu</Text>
              <View style={styles.timeDisplay}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{timeParts.hours}</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{timeParts.minutes}</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{timeParts.seconds}</Text>
                </View>
                <Text style={styles.timePeriod}>{timeParts.period}</Text>
              </View>
            </View>
            <View style={styles.locationSection}>
              <AntDesign
                name="enviromento"
                size={20}
                color={APP_COLOR.ORANGE}
                style={styles.locationIcon}
              />
              <Text style={styles.addressText} numberOfLines={2}>
                {address}
              </Text>
            </View>
            {loading ? (
              <View style={styles.mapPlaceholder}>
                <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
                <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
              </View>
            ) : location ? (
              <View style={styles.mapContainer}>
                {Platform.OS !== "web" ? (
                  <MapView
                    style={styles.map}
                    {...(region
                      ? { region }
                      : {
                          initialRegion: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          },
                        })}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation={true}
                    provider={PROVIDER_GOOGLE}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                    >
                      <View style={styles.markerContainer}>
                        <View style={styles.markerPin}>
                          <AntDesign
                            name="enviroment"
                            size={24}
                            color={APP_COLOR.WHITE}
                          />
                        </View>
                      </View>
                    </Marker>
                  </MapView>
                ) : (
                  <View style={styles.mapPlaceholder}>
                    <Text style={styles.loadingText}>
                      Bản đồ không hỗ trợ trên web
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.loadingText}>
                  Không thể hiển thị bản đồ
                </Text>
              </View>
            )}
            <Pressable
              style={[
                styles.checkInButton,
                isCheckedIn && styles.checkOutButton,
              ]}
              onPress={handleCheckIn}
            >
              <AntDesign
                name={isCheckedIn ? "closecircle" : "checkcircle"}
                size={32}
                color={APP_COLOR.WHITE}
                style={styles.checkInIcon}
              />
              <Text style={styles.checkInText}>
                {isCheckedIn ? "Kết thúc ca làm" : "Bắt đầu ca làm"}
              </Text>
            </Pressable>
            <View style={styles.actionIcons}>
              <Pressable style={styles.actionIcon}>
                <AntDesign name="left" size={20} color={APP_COLOR.SOFT_BLUE} />
              </Pressable>
              <Pressable style={styles.actionIcon}>
                <AntDesign name="right" size={20} color={APP_COLOR.SOFT_BLUE} />
              </Pressable>
              <Pressable style={styles.actionIcon}>
                <AntDesign
                  name="clockcircleo"
                  size={20}
                  color={APP_COLOR.SOFT_BLUE}
                />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.contentCard}>
            <Text style={styles.emptyText}>
              Danh sách chấm công sẽ được hiển thị ở đây
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: APP_COLOR.ORANGE,
  },
  tabText: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  activeTabText: {
    color: APP_COLOR.WHITE,
    fontFamily: APP_FONT.SEMIBOLD,
  },
  contentCard: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 10,
  },
  checkInTimeText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.ORANGE,
    marginBottom: 20,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeLabel: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.GREY,
    marginBottom: 10,
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeBox: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  timeText: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 24,
    color: APP_COLOR.BROWN,
  },
  timeSeparator: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 24,
    color: APP_COLOR.BROWN,
  },
  timePeriod: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginLeft: 8,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 8,
  },
  locationIcon: {
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    lineHeight: 20,
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#E0E0E0",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
  },
  loadingText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.GREY,
    marginTop: 10,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkInButton: {
    backgroundColor: "#1A3F22",
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  checkOutButton: {
    backgroundColor: APP_COLOR.CANCEL,
  },
  checkInIcon: {
    marginTop: -2,
  },
  checkInText: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 18,
    color: APP_COLOR.WHITE,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.GREY,
    textAlign: "center",
    paddingVertical: 40,
  },
});

export default AttendanceScreen;
