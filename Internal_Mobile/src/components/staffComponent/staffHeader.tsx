import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
interface IStaff {
  staffName?: string;
  staffCounter?: string;
}
const StaffHeader = (props: IStaff) => {
  const { setAppState } = useCurrentApp();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          setAppState(null);
          router.navigate("/(auth)/welcome");
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        gap: 10,
        alignItems: "center",
        backgroundColor: "rgb(0, 0, 0, 0.5)",
        borderRadius: 13,
        borderBottomWidth: 0.5,
        borderBottomColor: APP_COLOR.BROWN,
        paddingBottom: 10,
      }}
    >
      <View>
        <View style={styles.infoContent}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color={APP_COLOR.BROWN}
          />
          <Text style={styles.text}>
            {props.staffName ? props.staffName : ""}
          </Text>
        </View>
        <View style={styles.infoContent}>
          <FontAwesome5 name="store" size={20} color={APP_COLOR.BROWN} />
          <Text style={[styles.text, { width: "80%" }]}>
            {props.staffCounter ? props.staffCounter : ""}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color={APP_COLOR.BROWN} />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: APP_FONT.REGULAR,
    color: APP_COLOR.BROWN,
    fontSize: 17,
  },
  infoContent: { flexDirection: "row", gap: 10, marginVertical: 2.5 },
});
export default StaffHeader;
