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
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 15,
          color: APP_COLOR.BROWN,
        }}
      >
        {title}
        {":"}
      </Text>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 5,
          paddingVertical: 10,
          borderWidth: 0.5,
          borderColor: APP_COLOR.BROWN,
          borderRadius: 10,
        }}
      >
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
