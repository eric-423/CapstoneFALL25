import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";

type Params = {
  mode?: string;
  redirect?: string;
};

const QRCodeScanPage = () => {
  const { mode = "order", redirect } = useLocalSearchParams<Params>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string>("Đưa mã QR vào khung quét");

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const parseOrderId = useCallback((data: string) => {
    const match = data.match(/\d+/);
    return match ? match[0] : null;
  }, []);

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setError(null);
      Vibration.vibrate(100);

      const orderId = parseOrderId(data);
      if (mode === "order") {
        if (!orderId) {
          setError("Không nhận diện được mã đơn hàng. Vui lòng thử lại.");
          setScanned(false);
          return;
        }
        setInfo(`Đã nhận mã đơn #${orderId}, đang mở chi tiết...`);
        const targetPath = redirect || "/(user)/order/[id]";
        router.replace({
          pathname: targetPath,
          params: { id: orderId },
        } as any);
      } else {
        setInfo("Đã quét mã QR");
      }
    },
    [mode, parseOrderId, redirect, scanned]
  );

  const renderPermissionState = useMemo(() => {
    if (!permission) {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={APP_COLOR.ORANGE} />
          <Text style={styles.message}>Đang kiểm tra quyền camera...</Text>
        </View>
      );
    }
    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="camera-off"
            size={40}
            color={APP_COLOR.BROWN}
          />
          <Text style={styles.message}>
            Ứng dụng cần quyền truy cập camera để quét QR.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestPermission}
          >
            <Text style={styles.primaryText}>Cấp quyền camera</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [permission, requestPermission]);

  if (renderPermissionState) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={26}
            color={APP_COLOR.ORANGE}
          />
          <Text style={styles.headerText}>Quét mã QR đơn hàng</Text>
        </View>
        {renderPermissionState}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={[styles.mask, styles.maskVertical]} />
            <View style={styles.middleRow}>
              <View style={[styles.mask, styles.maskHorizontal]} />
              <View style={styles.focusBox}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
              <View style={[styles.mask, styles.maskHorizontal]} />
            </View>
            <View style={[styles.mask, styles.maskVertical]} />
          </View>
        </CameraView>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.secondaryButton, { marginLeft: 10 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  mask: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  maskVertical: {
    height: "20%",
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    height: "60%",
  },
  maskHorizontal: {
    flex: 1,
  },
  focusBox: {
    flex: 3,
    aspectRatio: 1,
    borderColor: APP_COLOR.ORANGE,
    borderWidth: 2,
    position: "relative",
    alignSelf: "center",
    maxWidth: "75%",
    maxHeight: "75%",
  },
  corner: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: APP_COLOR.ORANGE,
  },
  cornerTopLeft: {
    top: -20,
    left: -20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  cornerTopRight: {
    top: -20,
    right: -20,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -20,
    left: -20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: -20,
    right: -20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  errorText: {
    marginTop: 6,
    color: APP_COLOR.CANCEL,
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  actions: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  primaryButton: {
    backgroundColor: APP_COLOR.ORANGE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 0.5,
    borderColor: APP_COLOR.ORANGE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  message: {
    marginTop: 8,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    textAlign: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
});

export default QRCodeScanPage;
