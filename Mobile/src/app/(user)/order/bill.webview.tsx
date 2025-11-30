import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { APP_COLOR } from "@/utils/constant";
import { AntDesign } from "@expo/vector-icons";
import HeaderHome from "@/components/home/header.home";
import { FONTS } from "@/theme/typography";

const BillWebViewPage = () => {
  const { billUrl } = useLocalSearchParams<{ billUrl: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const getPdfViewerUrl = (url: string) => {
    if (!url) return url;
    if (url.toLowerCase().endsWith(".pdf") || url.includes(".pdf")) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(
        url
      )}&embedded=true`;
    }
    return url;
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError(
          "Tải hóa đơn quá lâu. Vui lòng thử lại hoặc kiểm tra kết nối mạng."
        );
      }
    }, 30000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading]);

  if (!billUrl) {
    return (
      <View style={styles.container}>
        <HeaderHome pageName="billWebView" />
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
            Không tìm thấy hóa đơn
          </Text>
        </View>
      </View>
    );
  }

  const pdfUrl = getPdfViewerUrl(Array.isArray(billUrl) ? billUrl[0] : billUrl);

  return (
    <View style={styles.container}>
      <HeaderHome pageName="billWebView" />
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setLoading(false);
            setError("Tải hóa đơn quá lâu. Vui lòng thử lại.");
          }, 30000);
        }}
        onLoadEnd={() => {
          setLoading(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error: ", nativeEvent);
          setLoading(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setError("Không thể tải hóa đơn. Vui lòng thử lại.");
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView HTTP error: ", nativeEvent);
          setLoading(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setError(
            `Lỗi HTTP ${nativeEvent.statusCode}: Không thể tải hóa đơn.`
          );
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        originWhitelist={["*"]}
        mixedContentMode="always"
        onShouldStartLoadWithRequest={(request) => {
          console.log("Loading URL:", request.url);
          return true;
        }}
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
            Đang tải hóa đơn...
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

export default BillWebViewPage;
