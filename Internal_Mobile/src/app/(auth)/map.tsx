import ShareButton from "@/components/btnComponent/shareBtn";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { confirmOrder, sendShipperLocation } from "@/utils/api";
import { GOOGLE_API_KEY } from "@/utils/constant";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationData {
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const { orderId, address, orderName } = useLocalSearchParams<{
    orderId: string;
    address: string;
    orderName: string;
  }>();
  const orderIdNum = parseInt(orderId || "0", 10);
  const { appState } = useCurrentApp();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const lastSendTimeRef = useRef<number>(0);
  const THROTTLE_INTERVAL = 5000;
  const isAuthorizedRef = useRef<boolean>(true);
  useEffect(() => {
    getCurrentLocation();
  }, []);
  const geocodeAddress = async (addressString: string) => {
    try {
      const encodedAddress = encodeURIComponent(addressString);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        console.error("Geocoding failed:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };
  useEffect(() => {
    const setDestinationFromAddress = async () => {
      if (address && location) {
        const destinationCoords = await geocodeAddress(address);
        if (destinationCoords) {
          setDestination(destinationCoords);
          const minLat = Math.min(
            location.latitude,
            destinationCoords.latitude
          );
          const maxLat = Math.max(
            location.latitude,
            destinationCoords.latitude
          );
          const minLng = Math.min(
            location.longitude,
            destinationCoords.longitude
          );
          const maxLng = Math.max(
            location.longitude,
            destinationCoords.longitude
          );

          const latDelta = (maxLat - minLat) * 1.5;
          const lngDelta = (maxLng - minLng) * 1.5;

          setRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max(latDelta, 0.01),
            longitudeDelta: Math.max(lngDelta, 0.01),
          });
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể tìm thấy địa chỉ. Vui lòng kiểm tra lại địa chỉ."
          );
        }
      }
    };

    setDestinationFromAddress();
  }, [address, location]);

  const sendLocationUpdate = useCallback(
    async (latitude: number, longitude: number) => {
      if (!appState?.token || !orderIdNum || orderIdNum === 0) {
        return;
      }
      if (
        !isAuthorizedRef.current ||
        latitude === undefined ||
        longitude === undefined ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        return;
      }
      const now = Date.now();
      const timeSinceLastSend = now - lastSendTimeRef.current;
      if (timeSinceLastSend < THROTTLE_INTERVAL) {
        return;
      }
      lastSendTimeRef.current = now;

      try {
        await sendShipperLocation(appState.token, {
          orderId: orderIdNum,
          latitude,
          longitude,
        });
      } catch (error: any) {
        if (error?.response?.status === 500) {
          return;
        }
        // Nếu lỗi 400 (unauthorized), dừng việc gửi location
        if (error?.response?.status === 400) {
          isAuthorizedRef.current = false;
          console.warn(
            "Shipper không được phép gửi vị trí cho order này. Đã dừng gửi location."
          );
          return;
        }
        if (error?.response) {
          console.error("Error sending location:", {
            status: error.response.status,
            data: error.response.data,
            message: error.message,
          });
        } else {
          console.error("Error sending location:", error);
        }
      }
    },
    [appState?.token, orderIdNum]
  );

  useEffect(() => {
    if (!location || !orderIdNum || orderIdNum === 0 || !appState?.token) {
      return;
    }
    isAuthorizedRef.current = true;

    const timeoutId = setTimeout(() => {
      sendLocationUpdate(location.latitude, location.longitude);
    }, 5000);

    const intervalId = setInterval(() => {
      if (location && isAuthorizedRef.current) {
        sendLocationUpdate(location.latitude, location.longitude);
      }
    }, THROTTLE_INTERVAL);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [location, orderIdNum, appState?.token, sendLocationUpdate]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
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

      setLoading(false);
    } catch (err) {
      setError("Không thể lấy vị trí hiện tại");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
          <Text style={styles.loadingText}>
            Đang lấy vị trí của khách hàng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDestination({
      latitude,
      longitude,
    });
  };

  if (error || !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
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
        <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
        <View style={styles.headerButtons}>
          <Pressable onPress={getCurrentLocation} style={styles.refreshButton}>
            <AntDesign name="reload1" size={20} color={APP_COLOR.ORANGE} />
          </Pressable>
        </View>
      </View>
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
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
          onLongPress={handleMapLongPress}
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
          >
            <Image
              source={require("@/assets/shipper.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Marker>

          {destination && (
            <>
              <Marker
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                title="Điểm đích"
                description={`Lat: ${destination.latitude.toFixed(
                  6
                )}, Lng: ${destination.longitude.toFixed(6)}`}
                pinColor={APP_COLOR.SOFT_BLUE}
              />
              <MapViewDirections
                origin={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                destination={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                apikey={GOOGLE_API_KEY}
                strokeWidth={4}
                strokeColor={APP_COLOR.ORANGE}
                optimizeWaypoints={true}
                onReady={(result) => {
                  if (result.coordinates && result.coordinates.length > 0) {
                    const coordinates = [
                      {
                        latitude: location.latitude,
                        longitude: location.longitude,
                      },
                      {
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                      },
                      ...result.coordinates,
                    ];

                    const minLat = Math.min(
                      ...coordinates.map((c) => c.latitude)
                    );
                    const maxLat = Math.max(
                      ...coordinates.map((c) => c.latitude)
                    );
                    const minLng = Math.min(
                      ...coordinates.map((c) => c.longitude)
                    );
                    const maxLng = Math.max(
                      ...coordinates.map((c) => c.longitude)
                    );
                    const latDelta = (maxLat - minLat) * 1.5;
                    const lngDelta = (maxLng - minLng) * 1.5;
                    setRegion({
                      latitude: (minLat + maxLat) / 2,
                      longitude: (minLng + maxLng) / 2,
                      latitudeDelta: Math.max(latDelta, 0.01),
                      longitudeDelta: Math.max(lngDelta, 0.01),
                    });
                  }
                }}
                onError={(errorMessage) => {
                  console.error("Lỗi khi vẽ đường đi:", errorMessage);
                  Alert.alert(
                    "Lỗi",
                    "Không thể vẽ đường đi. Vui lòng thử lại.",
                    [{ text: "OK" }]
                  );
                }}
              />
            </>
          )}
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
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Đơn hàng đang vận chuyển:</Text>
          <Text style={styles.infoText}>
            {" "}
            <Text style={{ fontFamily: APP_FONT.SEMIBOLD }}>
              Địa chỉ đơn hàng:
            </Text>{" "}
            {address}
          </Text>
          <Text style={styles.infoText}>
            {" "}
            <Text style={{ fontFamily: APP_FONT.SEMIBOLD }}>
              Khách hàng nhận:
            </Text>{" "}
            {orderName}
          </Text>
        </View>
        <ShareButton
          title="Xác nhận giao hàng"
          onPress={() => {
            confirmOrder(appState?.token || "", orderIdNum).then((res) => {
              if (res.success) {
                Alert.alert("Thành công", "Đơn hàng đã được xác nhận");
              } else {
                Alert.alert("Lỗi", res.message);
              }
            });
          }}
          textStyle={{
            fontFamily: APP_FONT.SEMIBOLD,
            fontSize: 16,
            color: APP_COLOR.WHITE,
          }}
          btnStyle={{
            backgroundColor: APP_COLOR.ORANGE,
            marginHorizontal: 50,
            width: 250,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: -100,
          }}
        />
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    padding: 5,
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
  map: {
    flex: 0.75,
    position: "relative",
    bottom: -10,
  },
  infoContainer: {
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 0.4,
  },
  locationInfo: {
    marginBottom: 10,
  },
  locationLabel: {
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 20,
    color: APP_COLOR.BROWN,
    marginBottom: 5,
  },
  infoText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 16,
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
