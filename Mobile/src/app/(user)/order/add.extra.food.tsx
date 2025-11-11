import { APP_COLOR } from "@/utils/constant";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { FONTS } from "@/theme/typography";
import ItemExtra from "@/components/order/item.extra";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import { GetProductType } from "@/utils/api";
const AddExtraFoodPage = () => {
  const { productName, productTypeId } = useLocalSearchParams();
  const branchId = useCurrentApp();
  const [productTypes, setProductTypes] = useState<
    { id: number; name: string }[]
  >([]);
  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductType();
      const productTypeIdNum =
        typeof productTypeId === "string"
          ? Number(productTypeId)
          : Array.isArray(productTypeId)
          ? Number(productTypeId[0])
          : 0;
      const filteredItems = res.data.data
        .filter((item: any) => item.id !== productTypeIdNum && item.id > 1)
        .map((item: any) => ({ id: item.id, name: item.name }));
      setProductTypes(filteredItems);
    };
    fetchProductType();
  }, [productTypeId]);
  return (
    <View style={{ backgroundColor: APP_COLOR.BACKGROUND_ORANGE, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: 18,
            color: APP_COLOR.BROWN,
            marginRight: 30,
          }}
        >
          {productName}
        </Text>
      </View>
      {productTypes.map((item) => (
        <View key={item.id}>
          <Text>{item.name}</Text>
          <ItemExtra productId={item.id} branchId={branchId.branchId ?? 0} />
        </View>
      ))}
    </View>
  );
};
export default AddExtraFoodPage;
