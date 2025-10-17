import UserInfo from "@/components/account/user.info";
import { APP_COLOR } from "@/utils/constant";
import { View } from "react-native";

const InfoPage = () => {
  return (
    <>
      <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
        <UserInfo />
      </View>
    </>
  );
};

export default InfoPage;
