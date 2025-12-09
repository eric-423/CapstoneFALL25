import ItemAddress from "@/components/order/item.address";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCurrentApp } from "@/context/app.context";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { GetCustomerInformation } from "@/utils/api";
const AddressCreatePage = () => {
  const { appState } = useCurrentApp();
  const [customerInformation, setCustomerInformation] = useState<any>(null);

  const fetchCustomerInformation = useCallback(async () => {
    try {
      const res = await GetCustomerInformation(appState?.userInfo?.id || 0);
      setCustomerInformation(res.data.data);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  }, [appState?.userInfo?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomerInformation();
    }, [fetchCustomerInformation])
  );
  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: 20,
          color: APP_COLOR.BROWN,
          textAlign: "center",
          marginTop: 30,
        }}
      >
        Chọn địa chỉ nhận hàng
      </Text>
      <ScrollView
        style={{ flex: 1, paddingVertical: 10 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 16,
            color: APP_COLOR.BROWN,
          }}
        >
          Địa chỉ giao hàng
        </Text>
        {customerInformation &&
          Array.isArray(customerInformation) &&
          customerInformation.map((item: any, index: number) => (
            <ItemAddress
              key={item.id || `address-${index}`}
              cusName={item.fullName}
              cusPhone={item.phone}
              cusAddress={item.address}
              isDefault={item.isDefault}
              informationId={item.informationId}
              onDeleted={fetchCustomerInformation}
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
            marginBottom: 10,
            marginHorizontal: 10,
            borderRadius: 10,
          }}
          onPress={() => router.push("/(user)/order/address.new")}
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
