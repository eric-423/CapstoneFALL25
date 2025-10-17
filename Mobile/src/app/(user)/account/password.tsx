import UserPassword from "@/components/account/user.password";
import { APP_COLOR } from "@/utils/constant";
import { View } from "react-native";

const PasswordPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <UserPassword />
    </View>
  );
};

export default PasswordPage;
