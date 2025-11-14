import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationData {
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      // Yêu cầu quyền truy cập vị trí
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Quyền truy cập vị trí bị từ chối");
        Alert.alert(
          "Quyền truy cập vị trí",
          "Ứng dụng cần quyền truy cập vị trí để hiển thị bản đồ",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Lấy vị trí hiện tại
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi lấy vị trí:", err);
      setError("Không thể lấy vị trí hiện tại");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color={APP_COLOR.BROWN} />
          </Pressable>
          <Text style={styles.headerTitle}>Bản đồ vị trí</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
          <Text style={styles.loadingText}>Đang lấy vị trí...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color={APP_COLOR.BROWN} />
          </Pressable>
          <Text style={styles.headerTitle}>Bản đồ vị trí</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Không thể lấy vị trí"}
          </Text>
          <Pressable onPress={getCurrentLocation} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.headerTitle}>Vị trí hiện tại</Text>
        <Pressable onPress={getCurrentLocation} style={styles.refreshButton}>
          <AntDesign name="reload1" size={20} color={APP_COLOR.ORANGE} />
        </Pressable>
      </View>
      {Platform.OS !== "web" ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            description={`Lat: ${location.latitude.toFixed(
              6
            )}, Lng: ${location.longitude.toFixed(6)}`}
            pinColor={APP_COLOR.ORANGE}
          />
        </MapView>
      ) : (
        <View
          style={[
            styles.map,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.errorText}>
            Bản đồ không hỗ trợ trên web. Vui lòng sử dụng ứng dụng di động.
          </Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Vĩ độ: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.infoText}>
          Kinh độ: {location.longitude.toFixed(6)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: APP_COLOR.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  refreshButton: {
    padding: 5,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: APP_COLOR.WHITE,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginVertical: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: APP_FONT.REGULAR,
    fontSize: 16,
    color: APP_COLOR.BROWN,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 16,
    color: APP_COLOR.CANCEL,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: APP_COLOR.ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 16,
    color: APP_COLOR.WHITE,
  },
});

export default MapScreen;
