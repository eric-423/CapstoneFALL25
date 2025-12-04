import { APP_COLOR } from "@/constants/Colors";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingOverlay = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 999,
  },
  box: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: APP_COLOR.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default LoadingOverlay;
