import { APP_COLOR } from "@/utils/constant";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FONTS } from "@/theme/typography";
import ItemExtra from "@/components/order/item.extra";
import { useCurrentApp } from "@/context/app.context";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetProductType } from "@/utils/api";
import {
  currencyFormatter,
  getItemQuantity as getItemQuantityUtil,
} from "@/utils/cart";
import { AntDesign } from "@expo/vector-icons";
import ShareButton from "@/components/button/share.button";
interface IPropsProduct {
  productDescription: string;
  ProductType: {
    name: string;
    productTypeId: number;
  };
  name: string;
  productId: string;
  image: any;
  description: string;
  price: number;
  averageRating: number;
}
interface ModalContextType {
  handleQuantityChange: (item: IPropsProduct, action: "MINUS" | "PLUS") => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { cart, setCart, restaurant, setRestaurant } = useCurrentApp();

  const mockRestaurant = {
    _id: "mock_restaurant_1",
    name: "Số món đã đặt",
    menu: [],
  };

  useEffect(() => {
    if (!restaurant) {
      setRestaurant(mockRestaurant);
    }
  }, [restaurant, setRestaurant]);

  const handleQuantityChange = (
    item: IPropsProduct,
    action: "MINUS" | "PLUS"
  ) => {
    if (!restaurant?._id) return;
    const total = action === "MINUS" ? -1 : 1;
    const priceChange = total * item.price;

    const newCart = { ...cart };
    if (!newCart[restaurant._id]) {
      newCart[restaurant._id] = {
        sum: 0,
        quantity: 0,
        items: {},
      };
    }
    newCart[restaurant._id].sum =
      (newCart[restaurant._id].sum || 0) + priceChange;
    newCart[restaurant._id].quantity =
      (newCart[restaurant._id].quantity || 0) + total;

    if (!newCart[restaurant._id].items[item.productId]) {
      newCart[restaurant._id].items[item.productId] = {
        data: {
          ...item,
          basePrice: item.price,
          title: item.name,
        },
        quantity: 0,
      };
    }

    const currentQuantity =
      (newCart[restaurant._id].items[item.productId].quantity || 0) + total;

    if (currentQuantity <= 0) {
      delete newCart[restaurant._id].items[item.productId];
      if (Object.keys(newCart[restaurant._id].items).length === 0) {
        delete newCart[restaurant._id];
      }
    } else {
      newCart[restaurant._id].items[item.productId] = {
        data: {
          ...item,
          basePrice: item.price,
          title: item.name,
        },
        quantity: currentQuantity,
      };
    }
    setCart(newCart);
  };

  return (
    <ModalContext.Provider value={{ handleQuantityChange }}>
      {children}
    </ModalContext.Provider>
  );
};
const AddExtraFoodContent = () => {
  const { productName, productTypeId, productId, productPrice } =
    useLocalSearchParams();
  const { branchId, cart, restaurant } = useCurrentApp();
  const { handleQuantityChange } = useModal();
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
  const productIdStr =
    typeof productId === "string"
      ? productId
      : Array.isArray(productId)
      ? productId[0]
      : "";
  const productIdNum =
    typeof productTypeId === "string"
      ? Number(productTypeId)
      : Array.isArray(productTypeId)
      ? Number(productTypeId[0])
      : 0;

  const productPriceValue = useMemo(() => {
    if (productPrice) {
      const priceFromParams =
        typeof productPrice === "string"
          ? Number(productPrice)
          : Array.isArray(productPrice)
          ? Number(productPrice[0])
          : 0;
      if (priceFromParams > 0) return priceFromParams;
    }
    if (
      restaurant?._id &&
      productIdStr &&
      cart[restaurant._id]?.items[productIdStr]
    ) {
      const cartItem = cart[restaurant._id].items[productIdStr];
      return cartItem.data.price || cartItem.data.basePrice || 0;
    }
    return 0;
  }, [productPrice, productIdStr, cart, restaurant]);

  const item: IPropsProduct = {
    productId: productIdStr,
    name:
      typeof productName === "string"
        ? productName
        : Array.isArray(productName)
        ? productName[0]
        : "",
    price: productPriceValue,
    ProductType: {
      name: "",
      productTypeId: productIdNum,
    },
    productDescription: "",
    image: null,
    description: "",
    averageRating: 0,
  };

  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);

  return (
    <View style={{ backgroundColor: APP_COLOR.BACKGROUND_ORANGE, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              fontSize: 25,
              color: APP_COLOR.BROWN,
              marginRight: 30,
            }}
          >
            {productName}
          </Text>
        </View>
        {productTypes.map((item) => (
          <View key={item.id}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONTS.semiBold,
                color: APP_COLOR.BROWN,
              }}
            >
              {item.name}
            </Text>
            <ItemExtra productId={item.id} branchId={branchId ?? 0} />
          </View>
        ))}

        <View
          style={{
            borderTopColor: APP_COLOR.BROWN,
            borderTopWidth: 1,
            paddingTop: 10,
            backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={[
              styles.quantityContainer,
              { marginHorizontal: 10, marginBottom: 50 },
            ]}
          >
            <Pressable
              onPress={() => handleQuantityChange(item, "MINUS")}
              style={({ pressed }) => ({
                opacity:
                  getItemQuantity(productIdStr) > 0 ? (pressed ? 0.5 : 1) : 0.3,
              })}
              disabled={getItemQuantity(productIdStr) === 0}
            >
              <AntDesign
                name="minus-circle"
                size={30}
                color={
                  getItemQuantity(productIdStr) > 0
                    ? APP_COLOR.BUTTON_YELLOW
                    : APP_COLOR.BROWN
                }
              />
            </Pressable>
            <Text style={styles.quantityText}>
              {getItemQuantity(productIdStr)}
            </Text>
            <Pressable
              onPress={() => handleQuantityChange(item, "PLUS")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <AntDesign
                name="plus-circle"
                size={30}
                color={APP_COLOR.BUTTON_YELLOW}
              />
            </Pressable>
          </View>
          <ShareButton
            textStyle={styles.btnText}
            btnStyle={styles.btnStyle}
            title={`Đặt đơn ${currencyFormatter(
              cart[restaurant?._id as string]?.sum || 0
            )}`}
            onPress={() => {
              router.navigate("/(user)/order/cart");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const AddExtraFoodPage = () => {
  return (
    <ModalProvider>
      <AddExtraFoodContent />
    </ModalProvider>
  );
};
const styles = StyleSheet.create({
  quantityContainer: {
    height: 40,
    width: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    gap: 10,
  },
  quantityText: {
    minWidth: 25,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    justifyContent: "center",
  },
  btnText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  btnStyle: {
    height: 40,
    width: 220,
    justifyContent: "center",
  },
});
export default AddExtraFoodPage;
