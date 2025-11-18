import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

import ShareButton from "@/components/button/share.button";
import { useShipperLocationForCustomer } from "@/hooks/useShipperLocationForCustomer";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";

const DEFAULT_REGION: Region = {
  latitude: 10.77653,
  longitude: 106.700981,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const TrackOrderPage = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const orderIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = Number(orderIdParam);

  const { shipperLocation, isConnected, error } = useShipperLocationForCustomer(
    Number.isFinite(orderId) ? orderId : undefined
  );

  const [region, setRegion] = useState<Region | null>(null);
  const lastUpdated = useMemo(() => {
    if (!shipperLocation?.timestamp) return null;
    return new Date(shipperLocation.timestamp).toLocaleTimeString("vi-VN");
  }, [shipperLocation]);

  useEffect(() => {
    if (shipperLocation?.latitude && shipperLocation?.longitude) {
      setRegion((prev) => ({
        latitude: shipperLocation.latitude,
        longitude: shipperLocation.longitude,
        latitudeDelta: prev?.latitudeDelta ?? DEFAULT_REGION.latitudeDelta,
        longitudeDelta: prev?.longitudeDelta ?? DEFAULT_REGION.longitudeDelta,
      }));
    }
  }, [shipperLocation]);

  const centerOnShipper = () => {
    if (shipperLocation?.latitude && shipperLocation?.longitude) {
      setRegion({
        latitude: shipperLocation.latitude,
        longitude: shipperLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  if (!orderIdParam || !Number.isFinite(orderId)) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy mã đơn hàng hợp lệ.</Text>
        <ShareButton
          title="Quay lại"
          onPress={() => router.back()}
          btnStyle={{ marginTop: 10 }}
          textStyle={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.headerTitle}>Theo dõi đơn #{orderId}</Text>
        <Pressable style={styles.headerButton} onPress={centerOnShipper}>
          <Feather name="map-pin" size={20} color={APP_COLOR.ORANGE} />
        </Pressable>
      </View>

      <View style={styles.connectionRow}>
        <View
          style={[
            styles.connectionDot,
            { backgroundColor: isConnected ? "#3CCF4E" : APP_COLOR.CANCEL },
          ]}
        />
        <Text style={styles.connectionText}>
          {isConnected
            ? "Đang nhận tín hiệu từ shipper"
            : "Đang kết nối tới shipper..."}
        </Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.mapWrapper}>
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          loadingEnabled
          showsUserLocation={false}
          showsMyLocationButton={false}
          initialRegion={region || DEFAULT_REGION}
          region={region || DEFAULT_REGION}
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
              pinColor={APP_COLOR.ORANGE}
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
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cập nhật</Text>
              <Text style={styles.infoValue}>
                {lastUpdated || "Chưa có tín hiệu"}
              </Text>
            </View>
          </>
        ) : (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color={APP_COLOR.ORANGE} />
            <Text style={[styles.infoValue, { marginTop: 8 }]}>
              Chưa nhận được vị trí từ shipper. Vui lòng chờ trong giây lát.
            </Text>
          </View>
        )}
      </View>

      <ShareButton
        title="Quay lại lịch sử đơn"
        onPress={() => router.back()}
        btnStyle={styles.backButton}
        textStyle={{
          color: APP_COLOR.WHITE,
          fontFamily: FONTS.bold,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    paddingHorizontal: 16,
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
  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  connectionText: {
    fontFamily: FONTS.regular,
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
    gap: 10,
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
    color: APP_COLOR.GRAY,
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
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: APP_COLOR.BROWN,
    paddingHorizontal: 32,
  },
});

export default TrackOrderPage;
