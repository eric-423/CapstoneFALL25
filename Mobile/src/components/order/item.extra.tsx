import { FONTS } from "@/theme/typography";
import { GetProductByProductType } from "@/utils/api";
import { currencyFormatter } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CheckBox from "react-native-check-box";
import { useCurrentApp } from "@/context/app.context";
import { getItemQuantity as getItemQuantityUtil } from "@/utils/cart";

interface IProps {
  productId: number;
  branchId: number;
}
const ItemExtra = (props: IProps) => {
  const { productId, branchId } = props;
  const { cart, setCart, restaurant } = useCurrentApp();
  const [productTypeList, setProductTypeList] = useState<IProductType[]>([]);

  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductByProductType(branchId, productId);
      setProductTypeList(res.data.content);
    };
    fetchProductType();
  }, [branchId, productId]);

  const handleSelect = (item: any) => {
    if (!restaurant?._id) return;

    const itemProductId = String(item.productId);
    const currentQuantity = getItemQuantityUtil(
      cart,
      restaurant._id,
      itemProductId
    );
    const isChecked = currentQuantity > 0;

    const newCart = { ...cart };
    if (!newCart[restaurant._id]) {
      newCart[restaurant._id] = {
        sum: 0,
        quantity: 0,
        items: {},
      };
    }

    if (isChecked) {
      const priceChange = -item.productPrice;
      newCart[restaurant._id].sum =
        (newCart[restaurant._id].sum || 0) + priceChange;
      newCart[restaurant._id].quantity =
        (newCart[restaurant._id].quantity || 0) - 1;
      delete newCart[restaurant._id].items[itemProductId];

      if (Object.keys(newCart[restaurant._id].items).length === 0) {
        delete newCart[restaurant._id];
      }
    } else {
      const priceChange = item.productPrice;
      newCart[restaurant._id].sum =
        (newCart[restaurant._id].sum || 0) + priceChange;
      newCart[restaurant._id].quantity =
        (newCart[restaurant._id].quantity || 0) + 1;

      newCart[restaurant._id].items[itemProductId] = {
        data: {
          ProductType: {
            name: item.productType || "",
            productTypeId: productId,
          },
          name: item.productName,
          productId: itemProductId,
          image: item.productImage || "",
          description: item.productDescription || "",
          price: item.productPrice,
          basePrice: item.productPrice,
          title: item.productName,
        },
        quantity: 1,
      };
    }

    setCart(newCart);
  };

  const getItemQuantity = (itemProductId: number) =>
    getItemQuantityUtil(cart, restaurant?._id, String(itemProductId));
  return (
    <View>
      {productTypeList.map((item, index) => (
        <View
          key={`${item.productId}-${index}`}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginVertical: 5,
            borderBottomColor: APP_COLOR.BROWN,
            borderBottomWidth: 0.5,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONTS.regular,
              color: APP_COLOR.BROWN,
            }}
          >
            {item.productName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONTS.regular,
                color: APP_COLOR.BROWN,
              }}
            >
              {currencyFormatter(item.productPrice)}
            </Text>
            <CheckBox
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: APP_COLOR.BROWN,
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              checkedImage={
                <FontAwesome5 name="check" size={12} color={APP_COLOR.BROWN} />
              }
              unCheckedImage={
                <View
                  style={{
                    width: 8,
                    height: 8,
                  }}
                />
              }
              isChecked={getItemQuantity(item.productId) > 0}
              onClick={() => handleSelect(item)}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
export default ItemExtra;
