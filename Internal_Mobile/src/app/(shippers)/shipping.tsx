import OrderCard from "@/components/cardStaff/orderConfirmCard";
import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { StyleSheet, View } from "react-native";
const ShippingOrder = () => {
  const { appState } = useCurrentApp();
  return (
    <View style={styles.container}>
      <StaffHeader
        staffName={appState?.userInfo.fullName}
        staffCounter={appState?.userInfo.address}
      />

      <OrderCard isShipper={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  quickLoginWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  quickLoginBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  quickLoginText: {
    fontSize: 16,
    fontFamily: APP_FONT.BOLD,
    color: APP_COLOR.BROWN,
  },
});
export default ShippingOrder;
