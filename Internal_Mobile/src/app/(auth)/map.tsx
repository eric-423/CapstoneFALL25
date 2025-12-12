import ShareButton from "@/components/btnComponent/shareBtn";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { confirmOrder, sendShipperLocation } from "@/utils/api";
import { GOOGLE_API_KEY } from "@/utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationData {
  latitude: number;
  longitude: number;
}

const LOCATION_STORAGE_KEY = "current_location";

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
  const locationWatchSubscriptionRef =
    useRef<Location.LocationSubscription | null>(null);

  const screenHeight = Dimensions.get("window").height;
  const [contentHeight, setContentHeight] = useState<number>(0);
  const collapsedHeight = 200;
  const expandedHeight =
    contentHeight > 0
      ? Math.min(contentHeight + 30, screenHeight * 0.85)
      : screenHeight * 0.4;
  const maxTranslate = expandedHeight - collapsedHeight;
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useSharedValue(maxTranslate);

  useEffect(() => {
    if (contentHeight > 0 && maxTranslate > 0) {
      if (!isExpanded) {
        translateY.value = maxTranslate;
      } else {
        translateY.value = 0;
      }
    }
  }, [contentHeight, maxTranslate, isExpanded]);

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

  const saveLocationToStorage = async (loc: LocationData) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    } catch (error) {
      console.error("Error saving location to storage:", error);
    }
  };

  const getLocationFromStorage = async (): Promise<LocationData | null> => {
    try {
      const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error getting location from storage:", error);
    }
    return null;
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Kiểm tra xem location service có được bật không
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        setError("Dịch vụ vị trí chưa được bật");
        Alert.alert(
          "Dịch vụ vị trí",
          "Vui lòng bật dịch vụ vị trí trong cài đặt để sử dụng tính năng này",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setError("Quyền truy cập vị trí bị từ chối");
        Alert.alert(
          "Quyền truy cập vị trí",
          "Ứng dụng cần quyền truy cập vị trí để hiển thị bản đồ",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Yêu cầu background permission (không bắt buộc)
      try {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          console.warn(
            "Background location permission not granted, will use foreground only"
          );
        }
      } catch (bgError) {
        console.warn("Background permission request failed:", bgError);
        // Tiếp tục với foreground permission
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(newLocation);
      await saveLocationToStorage(newLocation);

      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Bắt đầu watch position với error handling
      try {
        locationWatchSubscriptionRef.current =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (locationUpdate) => {
              try {
                const updatedLocation = {
                  latitude: locationUpdate.coords.latitude,
                  longitude: locationUpdate.coords.longitude,
                };
                setLocation(updatedLocation);
                saveLocationToStorage(updatedLocation);
              } catch (updateError) {
                console.error("Error updating location:", updateError);
              }
            }
          );
        console.log("Location watching started successfully");
      } catch (watchError: any) {
        console.warn("Could not start location watching:", watchError);
        // Tiếp tục với app dù không thể watch position
        // App vẫn có thể lấy location khi cần
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Error getting current location:", err);
      setError("Không thể lấy vị trí hiện tại");
      setLoading(false);

      // Thử lấy location từ storage nếu có
      try {
        const storedLocation = await getLocationFromStorage();
        if (storedLocation) {
          setLocation(storedLocation);
          setRegion({
            latitude: storedLocation.latitude,
            longitude: storedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (storageError) {
        console.error("Error getting location from storage:", storageError);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (locationWatchSubscriptionRef.current) {
        locationWatchSubscriptionRef.current.remove();
        locationWatchSubscriptionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          try {
            const storedLocation = await getLocationFromStorage();
            if (storedLocation) {
              setLocation(storedLocation);
            }
            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            const newLocation = {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            };
            setLocation(newLocation);
            await saveLocationToStorage(newLocation);
          } catch (error) {
            console.error(
              "Error getting location when app becomes active:",
              error
            );
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDestination({
      latitude,
      longitude,
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const currentPosition = isExpanded ? 0 : maxTranslate;
      const newTranslate = currentPosition + event.translationY;

      translateY.value = Math.max(0, Math.min(maxTranslate, newTranslate));
    })
    .onEnd((event) => {
      const currentPosition = isExpanded ? 0 : maxTranslate;
      const finalPosition = currentPosition + event.translationY;
      const threshold = maxTranslate / 2;

      const shouldExpand = finalPosition < threshold || event.velocityY < -500;
      const shouldCollapse =
        finalPosition >= threshold || event.velocityY > 500;

      if (shouldExpand) {
        translateY.value = withSpring(0);
        runOnJS(setIsExpanded)(true);
      } else {
        translateY.value = withSpring(maxTranslate);
        runOnJS(setIsExpanded)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const toggleBottomSheet = () => {
    if (isExpanded) {
      translateY.value = withSpring(maxTranslate);
      setIsExpanded(false);
    } else {
      translateY.value = withSpring(0);
      setIsExpanded(true);
    }
  };

  const openGoogleMaps = async () => {
    try {
      if (!destination) {
        Alert.alert("Lỗi", "Không có địa chỉ đích để chỉ đường");
        return;
      }

      const { latitude, longitude } = destination;
      const url = Platform.select({
        ios: `maps://app?daddr=${latitude},${longitude}&directionsmode=driving`,
        android: `google.navigation:q=${latitude},${longitude}`,
      });

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          // Fallback to web Google Maps
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
          await Linking.openURL(webUrl);
        }
      } else {
        // Fallback to web Google Maps
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Error opening Google Maps:", error);
      Alert.alert("Lỗi", "Không thể mở Google Maps. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
          <Text style={styles.loadingText}>
            Đang lấy vị trí của khách hàng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !location) {
    return (
      <SafeAreaView style={styles.container}>
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
                pinColor={APP_COLOR.ORANGE}
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
      <View
        style={styles.hiddenMeasureView}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && Math.abs(contentHeight - height) > 5) {
            setContentHeight(height);
          }
        }}
      >
        <View style={styles.contentWrapper}>
          <Pressable style={styles.dragHandle} onPress={toggleBottomSheet}>
            <View style={styles.dragHandleBar} />
          </Pressable>
          <View style={styles.locationInfo}>
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
          <View style={styles.buttonContainer}>
            <ShareButton
              title="Mở Google Maps"
              onPress={openGoogleMaps}
              textStyle={{
                fontFamily: APP_FONT.SEMIBOLD,
                fontSize: 16,
                color: APP_COLOR.WHITE,
              }}
              btnStyle={{
                backgroundColor: APP_COLOR.BROWN,
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                minHeight: 48,
              }}
            />
            <ShareButton
              title="Xác nhận giao hàng"
              onPress={() => {
                confirmOrder(appState?.token || "", orderIdNum).then((res) => {
                  if (res) {
                    Alert.alert("Thành công", "Đơn hàng đã được xác nhận");
                    router.replace("/(shippers)");
                  } else {
                    Alert.alert("Lỗi", "Không thể xác nhận đơn hàng");
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
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                minHeight: 48,
              }}
            />
          </View>
        </View>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.infoContainer,
            { height: expandedHeight },
            animatedStyle,
          ]}
        >
          <View style={styles.contentWrapper}>
            <Pressable style={styles.dragHandle} onPress={toggleBottomSheet}>
              <View style={styles.dragHandleBar} />
            </Pressable>
            <View style={styles.locationInfo}>
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
            <View style={styles.buttonContainer}>
              <ShareButton
                title="Mở Google Maps"
                onPress={openGoogleMaps}
                textStyle={{
                  fontFamily: APP_FONT.SEMIBOLD,
                  fontSize: 16,
                  color: APP_COLOR.WHITE,
                }}
                btnStyle={{
                  backgroundColor: APP_COLOR.BROWN,
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 48,
                }}
              />
              <ShareButton
                title="Xác nhận giao hàng"
                onPress={() => {
                  confirmOrder(appState?.token || "", orderIdNum).then(
                    (res) => {
                      if (res) {
                        Alert.alert("Thành công", "Đơn hàng đã được xác nhận");
                        router.replace("/(shippers)");
                      } else {
                        Alert.alert("Lỗi", "Không thể xác nhận đơn hàng");
                      }
                    }
                  );
                }}
                textStyle={{
                  fontFamily: APP_FONT.SEMIBOLD,
                  fontSize: 16,
                  color: APP_COLOR.WHITE,
                }}
                btnStyle={{
                  backgroundColor: APP_COLOR.ORANGE,
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 48,
                }}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
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
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
  map: {
    flex: 1,
    position: "relative",
    bottom: -10,
  },
  infoContainer: {
    backgroundColor: APP_COLOR.WHITE,
    padding: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentWrapper: {
    padding: 5,
  },
  hiddenMeasureView: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
    width: "100%",
  },
  dragHandle: {
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 5,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: APP_COLOR.BROWN,
    borderRadius: 2,
    opacity: 0.5,
  },
  locationInfo: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginHorizontal: 10,
    gap: 10,
    alignItems: "stretch",
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
