import ManageCard from "@/components/cardStaff/manageCard";
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
        <ManageCard />
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
