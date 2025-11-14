import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useShipperLocationSocket } from "@/hooks/useShipperLocationSocket";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const ShipperTrackingScreen = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const orderIdNum = parseInt(orderId || "0", 10);
  const { isConnected, sendLocationUpdate, connectionMode } =
    useShipperLocationSocket(orderIdNum);

  useEffect(() => {
    if (connectionMode === "none") {
      return;
    }

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission denied");
          return;
        }

        const sendFirstLocation = async () => {
          try {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            if (
              position?.coords?.latitude &&
              position?.coords?.longitude &&
              !isNaN(position.coords.latitude) &&
              !isNaN(position.coords.longitude)
            ) {
              sendLocationUpdate({
                orderId: orderIdNum,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            }
          } catch (error: any) {
            console.error("Location error:", error);
          }
        };

        await sendFirstLocation();
      } catch (error: any) {
        console.error("Error starting location tracking:", error);
      }
    };

    startLocationTracking();

    const interval = setInterval(async () => {
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (
          position?.coords?.latitude &&
          position?.coords?.longitude &&
          !isNaN(position.coords.latitude) &&
          !isNaN(position.coords.longitude)
        ) {
          sendLocationUpdate({
            orderId: orderIdNum,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      } catch (error: any) {
        console.error("Location error in interval:", error);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [orderIdNum, sendLocationUpdate, connectionMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Order: {orderId}</Text>
      <Text style={styles.status}>
        Status: {isConnected ? "Connected" : "Disconnected"}
      </Text>
      <Text style={styles.modeText}>
        Mode:{" "}
        {connectionMode === "websocket"
          ? "WebSocket"
          : connectionMode === "http"
          ? "HTTP"
          : "None"}
      </Text>
      <Text style={styles.infoText}>
        Đang gửi location updates mỗi 5 giây...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: APP_COLOR.WHITE,
  },
  title: {
    fontSize: 20,
    fontFamily: APP_FONT.BOLD,
    color: APP_COLOR.BROWN,
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    fontFamily: APP_FONT.REGULAR,
    color: APP_COLOR.BROWN,
    marginBottom: 5,
  },
  modeText: {
    fontSize: 14,
    fontFamily: APP_FONT.REGULAR,
    color: APP_COLOR.ORANGE,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: APP_FONT.REGULAR,
    color: APP_COLOR.BROWN,
    marginTop: 10,
  },
});

export default ShipperTrackingScreen;
