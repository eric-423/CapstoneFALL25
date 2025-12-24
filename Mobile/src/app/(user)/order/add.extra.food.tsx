import { APP_COLOR } from "@/utils/constant";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FONTS } from "@/theme/typography";
import ItemExtra from "@/components/order/item.extra";
import { useCurrentApp } from "@/context/app.context";
import React, { createContext, useContext, useEffect, useMemo } from "react";
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
  const { productId: productIdParam } = useLocalSearchParams();
  const { cart, restaurant } = useCurrentApp();
  const { handleQuantityChange } = useModal();

  const productId = (() => {
    if (typeof productIdParam === "string") {
      return Number(productIdParam);
    } else if (Array.isArray(productIdParam)) {
      return Number(productIdParam[0]);
    } else if (typeof productIdParam === "number") {
      return productIdParam;
    }
    return 0;
  })();

  const productIdStr = String(productId);

  const productPriceValue = useMemo(() => {
    if (
      restaurant?._id &&
      productIdStr &&
      cart[restaurant._id]?.items[productIdStr]
    ) {
      const cartItem = cart[restaurant._id].items[productIdStr];
      return cartItem.data.price || cartItem.data.basePrice || 0;
    }
    return 0;
  }, [productIdStr, cart, restaurant]);

  const item: IPropsProduct = {
    productId: productIdStr,
    name: "",
    price: productPriceValue,
    ProductType: {
      name: "",
      productTypeId: productId,
    },
    productDescription: "",
    image: null,
    description: "",
    averageRating: 0,
  };

  return (
    <View style={{ backgroundColor: APP_COLOR.BACKGROUND_ORANGE, flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ItemExtra productId={productId} />
      </ScrollView>
      <View
        style={{
          borderTopColor: APP_COLOR.BROWN,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
        }}
      >
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
