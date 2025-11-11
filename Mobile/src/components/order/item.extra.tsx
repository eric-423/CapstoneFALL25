import { GetProductByProductType } from "@/utils/api";
import { currencyFormatter } from "@/utils/cart";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
interface IProps {
  productId: number;
  branchId: number;
}
const ItemExtra = (props: IProps) => {
  const { productId, branchId } = props;
  const [productTypeList, setProductTypeList] = useState<IProductType[]>([]);
  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductByProductType(branchId, productId);
      setProductTypeList(res.data.content);
    };
    fetchProductType();
  }, []);
  return (
    <View>
      {productTypeList.map((item) => (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text key={item.productId}>{item.productName}</Text>
          <Text key={item.productId}>
            {currencyFormatter(item.productPrice)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ItemExtra;
