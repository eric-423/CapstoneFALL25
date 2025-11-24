import { APP_COLOR } from "@/constants/Colors";
import { FONTS } from "@/themes/typography";
import { Text, View } from "react-native";

interface IOrderCard {
  title: string;
  count: number;
}
const OrderCard = (props: IOrderCard) => {
  const { title, count } = props;
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        borderColor: APP_COLOR.ORANGE,
        borderWidth: 1,
        backgroundColor: APP_COLOR.WHITE,
        alignItems: "center",
        justifyContent: "center",
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
      <Text
        style={{ fontSize: 24, fontFamily: FONTS.bold, color: APP_COLOR.BROWN }}
      >
        {count}
      </Text>
    </View>
  );
};
export default OrderCard;
