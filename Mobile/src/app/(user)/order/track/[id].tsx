import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MapView, {
  Marker,
  Polyline,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import ShareButton from "@/components/button/share.button";
import { useShipperLocationForCustomer } from "@/hooks/useShipperLocationForCustomer";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { geocodeAddress, getDirections } from "@/utils/api";

const DEFAULT_REGION: Region = {
  latitude: 10.77653,
  longitude: 106.700981,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const decodePolyline = (encoded: string) => {
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
};
const TrackOrderPage = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const orderIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = Number(orderIdParam);
  const { shipperLocation, error } = useShipperLocationForCustomer(
    Number.isFinite(orderId) ? orderId : undefined
  );
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [customerCoordinate, setCustomerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const lastUpdated = useMemo(() => {
    if (!shipperLocation?.timestamp) return null;
    return new Date(shipperLocation.timestamp).toLocaleTimeString("vi-VN");
  }, [shipperLocation]);
  useEffect(() => {
    if (shipperLocation?.latitude && shipperLocation?.longitude) {
      setRegion((prev) => ({
        latitude: shipperLocation.latitude,
        longitude: shipperLocation.longitude,
        latitudeDelta: prev.latitudeDelta,
        longitudeDelta: prev.longitudeDelta,
      }));
    }
  }, [shipperLocation]);

  useEffect(() => {
    let isMounted = true;
    const resolveAddress = async () => {
      if (!shipperLocation?.customerAddress) {
        setCustomerCoordinate(null);
        return;
      }
      setIsResolvingAddress(true);
      setGeocodeError(null);
      try {
        const coords = await geocodeAddress(shipperLocation.customerAddress);
        if (isMounted) {
          setCustomerCoordinate(coords);
        }
      } catch (err) {
        if (isMounted) {
          setCustomerCoordinate(null);
          setGeocodeError("Không thể xác định vị trí giao hàng");
        }
      } finally {
        if (isMounted) {
          setIsResolvingAddress(false);
        }
      }
    };
    resolveAddress();
    return () => {
      isMounted = false;
    };
  }, [shipperLocation?.customerAddress]);

  useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      if (!shipperLocation || !customerCoordinate) {
        setRouteCoords([]);
        return;
      }
      setRouteLoading(true);
      setRouteError(null);
      try {
        const encoded = await getDirections(
          {
            latitude: shipperLocation.latitude,
            longitude: shipperLocation.longitude,
          },
          customerCoordinate
        );
        if (!isMounted) return;
        const decoded = decodePolyline(encoded);
        setRouteCoords(decoded);
      } catch (err) {
        if (isMounted) {
          setRouteCoords([]);
          setRouteError("Không thể tải tuyến đường");
        }
      } finally {
        if (isMounted) {
          setRouteLoading(false);
        }
      }
    };
    fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [shipperLocation, customerCoordinate]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (shipperLocation && customerCoordinate) {
      mapRef.current.fitToCoordinates(
        routeCoords.length > 0
          ? routeCoords
          : [
              {
                latitude: shipperLocation.latitude,
                longitude: shipperLocation.longitude,
              },
              customerCoordinate,
            ],
        {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        }
      );
    } else if (shipperLocation) {
      mapRef.current.animateCamera({
        center: {
          latitude: shipperLocation.latitude,
          longitude: shipperLocation.longitude,
        },
        zoom: 15,
      });
    }
  }, [shipperLocation, customerCoordinate, routeCoords]);
  if (!orderIdParam || !Number.isFinite(orderId)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy mã đơn hàng hợp lệ.</Text>
        <ShareButton
          title="Quay lại"
          onPress={() => router.back()}
          btnStyle={{ marginTop: 10 }}
          textStyle={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          loadingEnabled
          showsUserLocation={false}
          showsMyLocationButton={false}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {shipperLocation && (
            <Marker
              coordinate={{
                latitude: shipperLocation.latitude,
                longitude: shipperLocation.longitude,
              }}
              title={shipperLocation.shipperName || "Shipper"}
              description={
                lastUpdated ? `Cập nhật lúc ${lastUpdated}` : undefined
              }
            >
              <Image
                source={require("@/assets/shipper.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </Marker>
          )}
          {customerCoordinate && (
            <Marker
              coordinate={customerCoordinate}
              title="Điểm giao hàng"
              pinColor={APP_COLOR.BROWN}
            />
          )}
          {shipperLocation && customerCoordinate && (
            <Polyline
              coordinates={
                routeCoords.length > 0
                  ? routeCoords
                  : [
                      {
                        latitude: shipperLocation.latitude,
                        longitude: shipperLocation.longitude,
                      },
                      customerCoordinate,
                    ]
              }
              strokeColor={APP_COLOR.ORANGE}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      </View>
      <View style={styles.infoCard}>
        {shipperLocation ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shipper</Text>
              <Text style={styles.infoValue}>
                {shipperLocation.shipperName || "Đang cập nhật"}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.addressRow]}>
              <Text style={styles.infoLabel}>Địa chỉ giao</Text>
              <Text style={[styles.infoValue, styles.addressValue]}>
                {shipperLocation.customerAddress || "Đang cập nhật"}
              </Text>
            </View>
            {isResolvingAddress && (
              <View style={{ marginBottom: 8 }}>
                <ActivityIndicator color={APP_COLOR.ORANGE} />
              </View>
            )}
            {geocodeError && (
              <Text
                style={[
                  styles.infoValue,
                  { color: APP_COLOR.CANCEL, textAlign: "left" },
                ]}
              >
                {geocodeError}
              </Text>
            )}
            {routeLoading && (
              <Text
                style={[
                  styles.infoValue,
                  styles.addressValue,
                  { color: APP_COLOR.BROWN },
                ]}
              >
                Đang tải tuyến đường...
              </Text>
            )}
            {routeError && (
              <Text
                style={[
                  styles.infoValue,
                  styles.addressValue,
                  { color: APP_COLOR.CANCEL },
                ]}
              >
                {routeError}
              </Text>
            )}
          </>
        ) : (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color={APP_COLOR.ORANGE} />
            <Text
              style={[
                styles.infoValue,
                { marginVertical: 5, textAlign: "center" },
              ]}
            >
              Chưa nhận được vị trí từ shipper. Vui lòng chờ trong giây lát.
            </Text>
          </View>
        )}
        <View style={{ alignSelf: "center" }}>
          <ShareButton
            title="Quay lại lịch sử đơn"
            onPress={() => router.back()}
            btnStyle={styles.backButton}
            textStyle={{
              color: APP_COLOR.WHITE,
              fontFamily: FONTS.bold,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLOR.WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoLabel: {
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    fontSize: 15,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    flex: 1,
    textAlign: "right",
  },
  addressRow: {
    alignItems: "flex-start",
  },
  addressValue: {
    textAlign: "left",
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.CANCEL,
    textAlign: "center",
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: APP_COLOR.BROWN,
    paddingHorizontal: 32,
  },
});

export default TrackOrderPage;
