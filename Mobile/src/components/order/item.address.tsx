import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import CheckBox from "react-native-check-box";
interface IAddress {
  cusName: string;
  cusPhone: string;
  cusAddress: string;
  isDefault: boolean;
}
const ItemAddress = ({
  cusName,
  cusPhone,
  cusAddress,
  isDefault,
}: IAddress) => {
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
          borderColor: APP_COLOR.ORANGE,
          justifyContent: "center",
          alignItems: "center",
        }}
        checkedImage={
          <FontAwesome name="circle" size={14} color={APP_COLOR.ORANGE} />
        }
        unCheckedImage={<View style={{ width: 8, height: 8 }} />}
        isChecked={isDefault}
        onClick={() => {}}
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
            {cusName}
          </Text>
          <Text style={{ fontSize: 16, color: APP_COLOR.GRAY }}>|</Text>
          <Text style={{ fontSize: 16, color: APP_COLOR.BROWN }}>
            {cusPhone}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 14,
            color: APP_COLOR.BROWN,
          }}
        >
          {cusAddress}
        </Text>
        {isDefault == true && (
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 10,
              color: APP_COLOR.ORANGE,
              padding: 5,
              borderWidth: 0.5,
              borderColor: APP_COLOR.ORANGE,
              borderRadius: 5,
              width: 100,
              textAlign: "center",
            }}
          >
            Địa chỉ mặc định
          </Text>
        )}
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
