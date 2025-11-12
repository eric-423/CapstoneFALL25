import ItemAddress from "@/components/order/item.address";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
const AddressCreatePage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 20,
          color: APP_COLOR.BROWN,
          textAlign: "center",
        }}
      >
        Chọn địa chỉ nhận hàng
      </Text>
      <ScrollView style={{ flex: 1, paddingVertical: 10 }}>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: APP_COLOR.BROWN,
          }}
        >
          Địa chỉ giao hàng
        </Text>
        <ItemAddress />
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: APP_COLOR.WHITE,
            padding: 10,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={APP_COLOR.ORANGE}
          />
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: APP_COLOR.ORANGE,
            }}
          >
            Thêm địa chỉ mới
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};
export default AddressCreatePage;
