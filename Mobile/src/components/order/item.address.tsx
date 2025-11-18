import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/theme/typography";
import { DeleteCustomerInformation } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import CheckBox from "react-native-check-box";
import Swipeable from "react-native-gesture-handler/Swipeable";
interface IAddress {
  cusName: string;
  cusPhone: string;
  cusAddress: string;
  isDefault?: boolean;
  informationId?: number;
  onDeleted?: () => void;
}
const ItemAddress = ({
  cusName,
  cusPhone,
  cusAddress,
  isDefault,
  informationId,
  onDeleted,
}: IAddress) => {
  const { appState } = useCurrentApp();
  const handleDeleteCustomerInfor = async (informationId: number) => {
    try {
      await DeleteCustomerInformation(
        appState?.userInfo?.id || 0,
        informationId
      );
      await onDeleted?.();
    } catch (error) {
      console.error("Error deleting customer information:", error);
    }
  };
  const renderRightActions = () => (
    <Pressable
      onPress={() => handleDeleteCustomerInfor(informationId || 0)}
      style={{
        backgroundColor: "#ff3b30",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 14,
          color: APP_COLOR.WHITE,
        }}
      >
        Xóa
      </Text>
    </Pressable>
  );
  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: APP_COLOR.WHITE,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomColor: APP_COLOR.GRAY,
          borderBottomWidth: 0.5,
        }}
        onPress={() => {
          router.push({
            pathname: "/(auth)/change.info",
            params: {
              id: informationId,
              cusName: cusName,
              cusPhone: cusPhone,
              cusAddress: cusAddress,
              isDefault: isDefault ? "true" : "false",
            },
          });
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
              width: "50%",
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
      </Pressable>
    </Swipeable>
  );
};
export default ItemAddress;
