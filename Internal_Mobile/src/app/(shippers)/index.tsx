import OrderCard from "@/components/cardStaff/orderConfirmCard";
import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR } from "@/constants/Colors";
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
});
export default ShippingOrder;
