import ItemAddress from "@/components/order/item.address";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import { GetCustomerInformation } from "@/utils/api";
const AddressCreatePage = () => {
  const { appState } = useCurrentApp();
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  useEffect(() => {
    const fetchCustomerInformation = async () => {
      const res = await GetCustomerInformation(appState?.userInfo?.id || 0);
      setCustomerInformation(res.data.data);
    };
    fetchCustomerInformation();
  }, [appState]);
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
        {customerInformation?.map((item: any) => (
          <ItemAddress
            key={item.id}
            cusName={item.fullName}
            cusPhone={item.phone}
            cusAddress={item.address}
            isDefault={item.isDefault}
          />
        ))}
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
