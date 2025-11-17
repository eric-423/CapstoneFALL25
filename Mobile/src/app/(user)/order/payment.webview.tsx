import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { APP_COLOR } from "@/utils/constant";
import { AntDesign } from "@expo/vector-icons";
import HeaderHome from "@/components/home/header.home";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";

const PaymentWebViewPage = () => {
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCart } = useCurrentApp();
  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url.toLowerCase();
    if (url.includes("success") || url.includes("callback")) {
      console.log("Payment success detected:", url);
      router.replace("/(auth)/order.success");
    } else if (navState.url && navState.url.includes("payment-cancel")) {
      setCart([]);
      router.replace("/(tabs)");
    }
  };

  if (!paymentUrl) {
    return (
      <View style={styles.container}>
        <HeaderHome pageName="paymentWebView" />
        <View style={styles.errorContainer}>
          <AntDesign name="close-circle" size={48} color={APP_COLOR.CANCEL} />
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: APP_COLOR.BROWN,
              marginTop: 16,
            }}
          >
            Không tìm thấy URL thanh toán
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderHome pageName="paymentWebView" />
      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webview}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error: ", nativeEvent);
          setLoading(false);
          setError("Không thể tải trang thanh toán. Vui lòng thử lại.");
        }}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 14,
              color: APP_COLOR.BROWN,
              marginTop: 12,
            }}
          >
            Đang tải trang thanh toán...
          </Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <AntDesign
            name="exclamation-circle"
            size={48}
            color={APP_COLOR.CANCEL}
          />
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: APP_COLOR.BROWN,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentWebViewPage;
