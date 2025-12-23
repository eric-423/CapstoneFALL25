import { FONTS } from "@/theme/typography";
import { GetPairedProducts } from "@/utils/api";
import { currencyFormatter } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState, useMemo } from "react";
import { Text, View } from "react-native";
import CheckBox from "react-native-check-box";
import { useCurrentApp } from "@/context/app.context";
import { getItemQuantity as getItemQuantityUtil } from "@/utils/cart";

interface IProps {
  productId: number;
}
const ItemExtra = (props: IProps) => {
  const { productId } = props;
  const { cart, setCart, restaurant } = useCurrentApp();
  const [productTypeList, setProductTypeList] = useState<IProductType[]>([]);

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const res = await GetPairedProducts(productId);
        setProductTypeList(res.data.data || []);
      } catch (error) {
        console.error("Error fetching paired products:", error);
        setProductTypeList([]);
      }
    };
    fetchProductType();
  }, [productId]);

  const handleSelect = (item: any) => {
    if (!restaurant?._id) return;

    const extraItemId = `extra_${productId}_${item.productId}`;
    const newCart = { ...cart };

    if (!newCart[restaurant._id]) {
      newCart[restaurant._id] = {
        sum: 0,
        quantity: 0,
        items: {},
      };
    }

    const currentQuantity =
      newCart[restaurant._id].items[extraItemId]?.quantity || 0;
    const newQuantity = currentQuantity + 1;
    const priceChange = item.productPrice;

    newCart[restaurant._id].sum =
      (newCart[restaurant._id].sum || 0) + priceChange;
    newCart[restaurant._id].quantity =
      (newCart[restaurant._id].quantity || 0) + 1;

    newCart[restaurant._id].items[extraItemId] = {
      data: {
        ProductType: {
          name: item.productType || "",
          productTypeId: productId,
        },
        name: item.productName,
        productId: extraItemId,
        image: item.productImage || "",
        description: item.productDescription || "",
        price: item.productPrice,
        basePrice: item.productPrice,
        title: item.productName,
      },
      quantity: newQuantity,
    };

    setCart(newCart);
  };

  const getExtraItemQuantity = (extraProductId: number) => {
    if (!restaurant?._id) return 0;
    const extraItemId = `extra_${productId}_${extraProductId}`;
    return cart?.[restaurant._id]?.items?.[extraItemId]?.quantity || 0;
  };

  const groupedByProductType = useMemo(() => {
    const grouped: { [key: string]: IProductType[] } = {};
    productTypeList.forEach((item) => {
      const productType = (item as any).productType || "Khác";
      if (!grouped[productType]) {
        grouped[productType] = [];
      }
      grouped[productType].push(item);
    });
    return grouped;
  }, [productTypeList]);

  return (
    <View style={{ marginTop: 30 }}>
      <Text
        style={{
          fontSize: 18,
          fontFamily: FONTS.bold,
          color: APP_COLOR.BROWN,
          marginHorizontal: 10,
          marginTop: 15,
          marginBottom: 10,
        }}
      >
        Món ăn kèm bạn có thể chọn:
      </Text>
      {Object.keys(groupedByProductType).length === 0 ? (
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONTS.regular,
            color: APP_COLOR.BROWN,
            marginHorizontal: 10,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Không có món ăn kèm
        </Text>
      ) : (
        Object.entries(groupedByProductType).map(([productType, items]) => (
          <View key={productType}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONTS.semiBold,
                color: APP_COLOR.BROWN,
                marginHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              {productType}
            </Text>
            {items.map((item, index) => (
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
                      <FontAwesome5
                        name="check"
                        size={12}
                        color={APP_COLOR.BROWN}
                      />
                    }
                    unCheckedImage={
                      <View
                        style={{
                          width: 8,
                          height: 8,
                        }}
                      />
                    }
                    isChecked={getExtraItemQuantity(item.productId) > 0}
                    onClick={() => handleSelect(item)}
                  />
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
};
export default ItemExtra;
