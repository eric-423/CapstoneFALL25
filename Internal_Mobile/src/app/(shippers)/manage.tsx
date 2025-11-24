import AppFunction from "@/components/cardStaff/appFunction";
import ManageCard from "@/components/cardStaff/manageCard";
import OrderCard from "@/components/cardStaff/orderCard";
import StaffHeader from "@/components/staffComponent/staffHeader";
import { APP_COLOR } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { StyleSheet, View } from "react-native";

const DashboardPage = () => {
  const { appState } = useCurrentApp();
  return (
    <View style={styles.container}>
      <StaffHeader
        staffName={appState?.userInfo.fullName}
        staffCounter={appState?.userInfo.address}
      />
      <View>
        <View
          style={{
            marginHorizontal: 5,
            gap: 10,
            flexDirection: "row",
            marginVertical: 10,
            justifyContent: "space-around",
          }}
        >
          <OrderCard title="Đơn hàng chờ giao" count={3} />
          <OrderCard title="Đơn hàng hôm nay" count={3} />
        </View>
        <View
          style={{ height: 5, backgroundColor: APP_COLOR.GREY + "70" }}
        ></View>
        <View>
          <ManageCard title="Vận hành" />
          <ManageCard title="Dòng tiền" />
        </View>
        <View
          style={{ height: 5, backgroundColor: APP_COLOR.GREY + "70" }}
        ></View>
        <View>
          <AppFunction title="Thông tin tài khoản" />
          <AppFunction title="Đăng xuất" />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
});
export default DashboardPage;
