import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";
interface IDropDown {
  title: string;
  value: string;
}
const DropDown = (props: IDropDown) => {
  const { title, value } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 17,
          color: APP_COLOR.BROWN,
        }}
      >
        {title}
        {":"}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: APP_COLOR.BROWN,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
export default DropDown;
