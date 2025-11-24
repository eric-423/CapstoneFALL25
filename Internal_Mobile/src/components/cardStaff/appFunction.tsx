import { APP_COLOR } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/themes/typography";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Alert, Pressable, Text } from "react-native";
interface IFunction {
  title: string;
}
const AppFunction = (props: IFunction) => {
  const { title } = props;
  const { setAppState } = useCurrentApp();
  return (
    <Pressable
      style={{
        paddingVertical: 10,
        borderBottomColor: APP_COLOR.GREY,
        borderBottomWidth: 0.5,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() => {
        if (title === "Thông tin tài khoản") {
          router.navigate("/(auth)/account-info");
        } else if (title === "Đăng xuất") {
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
        }
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: FONTS.semiBold,
          color: APP_COLOR.BROWN,
        }}
      >
        {title}
      </Text>
      <AntDesign name="right" size={24} color={APP_COLOR.ORANGE} />
    </Pressable>
  );
};
export default AppFunction;
