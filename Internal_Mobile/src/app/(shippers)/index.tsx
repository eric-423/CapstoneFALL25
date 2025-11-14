import OrderCard from "@/components/cardStaff/orderConfirmCard";
import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

const ShippingOrder = () => {
  return (
    <View style={styles.container}>
      <StaffHeader />
      <OrderCard isShipper={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
});
export default ShippingOrder;
