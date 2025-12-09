import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef } from "react";
import { APP_COLOR } from "@/utils/constant";
import HeaderHome from "@/components/home/header.home";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";

const PaymentWebViewPage = () => {
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>();
  const [loading, setLoading] = useState(true);
  const [showWebView, setShowWebView] = useState(true);
  const { setCart } = useCurrentApp();

  const webViewRef = useRef<WebView>(null);
  const isNavigating = useRef(false);

  const handleNavigationStateChange = (navState: any) => {
    const url = (navState.url || "").toLowerCase();

    if (isNavigating.current) return;
    const handleRedirect = (targetRoute: string, shouldClearCart: boolean) => {
      isNavigating.current = true;

      if (webViewRef.current) webViewRef.current.stopLoading();
      setShowWebView(false);

      if (shouldClearCart) setCart({});

      setTimeout(() => {
        router.replace(targetRoute as any);
      }, 500);
    };
    if (url.includes("success") || url.includes("callback")) {
      handleRedirect("/(auth)/order.success", true);
    } else if (
      url.includes("payment-cancel") ||
      url.includes("cancel") ||
      url.includes("status=cancelled") ||
      url.includes("failed") ||
      url.includes("error")
    ) {
      handleRedirect("/(auth)/order.failure", false);
    }
  };
  if (!paymentUrl) return null;

  return (
    <View style={styles.container}>
      <HeaderHome pageName="paymentWebView" />

      {showWebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          style={[styles.webview, { opacity: loading ? 0 : 1 }]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          androidLayerType="hardware"
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
          <Text style={{ marginTop: 10, fontFamily: FONTS.regular }}>
            Đang xử lý kết quả...
          </Text>
        </View>
      )}

      {loading && showWebView && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
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
    backgroundColor: "rgba(255,255,255,1)",
    zIndex: 99,
  },
});

export default PaymentWebViewPage;
