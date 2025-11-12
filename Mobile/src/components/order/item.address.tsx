import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import CheckBox from "react-native-check-box";

const ItemAddress = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: APP_COLOR.WHITE,
        padding: 10,
        borderBottomColor: APP_COLOR.GRAY,
        borderBottomWidth: 0.5,
      }}
    >
      <CheckBox
        style={{
          width: 20,
          height: 20,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: APP_COLOR.BROWN,
        }}
        checkedImage={
          <FontAwesome5 name="check" size={12} color={APP_COLOR.BROWN} />
        }
        unCheckedImage={<View style={{ width: 8, height: 8 }} />}
      />
      <View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: APP_COLOR.BROWN,
            }}
          >
            Lê Minh Duy
          </Text>
          <Text style={{ fontSize: 16, color: APP_COLOR.GRAY }}>|</Text>
          <Text style={{ fontSize: 16, color: APP_COLOR.BROWN }}>
            0901234567
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 14,
            color: APP_COLOR.BROWN,
          }}
        >
          123 Đường ABC, Quận 1, TP.HCM
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 14,
          color: APP_COLOR.GRAY,
          position: "absolute",
          right: 10,
          top: 10,
        }}
      >
        Sửa
      </Text>
    </View>
  );
};
export default ItemAddress;
