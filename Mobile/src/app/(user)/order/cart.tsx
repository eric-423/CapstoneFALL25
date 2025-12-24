import React, { useMemo } from "react";
import { View, ScrollView, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import HeaderHome from "@/components/home/header.home";
import ItemCart from "@/components/order/item.cart";
import ShareButton from "@/components/button/share.button";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import {
  currencyFormatter,
  calculateTotalPrice,
  getItemQuantity as getItemQuantityUtil,
} from "@/utils/cart";
import { useCurrentApp } from "@/context/app.context";
import Toast from "react-native-root-toast";

const fallbackImage = require("@/assets/icons/com-tam.png");
const comboFallbackImage = require("@/assets/saleoff/combo.png");

const CartPage = () => {
  const { cart, setCart, restaurant, locationReal, appState } = useCurrentApp();
  const restaurantId = restaurant?._id;
  const restaurantCart = restaurantId ? cart?.[restaurantId] : undefined;

  const cartItems = useMemo(() => {
    if (!restaurantCart?.items) return [];
    return Object.entries(restaurantCart.items).map(([key, item]: any) => {
      const data = item?.data || {};
      const unitPrice = Number(
        data.basePrice || data.price || data.productPrice || 0
      );
      const quantityInBranch =
        typeof data.quantityInBranch === "number"
          ? data.quantityInBranch
          : undefined;
      const isCombo = data.isCombo || false;
      const defaultImage = isCombo ? comboFallbackImage : fallbackImage;
      const imageSource =
        typeof data.image === "string" && data.image.trim() !== ""
          ? { uri: data.image }
          : data.image || defaultImage;
      return {
        id: key,
        productId: key,
        image: imageSource,
        title: data.title || data.name || data.productName || "Sản phẩm",
        quantity: item?.quantity || 0,
        price: unitPrice * (item?.quantity || 0),
        unitPrice: unitPrice,
        quantityInBranch,
        description:
          data.description || data.productDescription || "Không có mô tả",
      };
    });
  }, [restaurantCart]);

  const totalAmount =
    restaurantCart?.sum ?? calculateTotalPrice(cart, restaurantId);
  const isCartEmpty = cartItems.length === 0;
  const shippingAddress =
    locationReal || "Chưa có địa chỉ giao hàng. Vui lòng cập nhật.";

  const handleCheckout = () => {
    if (isCartEmpty) return;
    router.navigate("/(user)/order/place.order");
  };

  const handleQuantityChange = (
    productId: string,
    action: "MINUS" | "PLUS"
  ) => {
    if (!restaurantId) return;

    const item = restaurantCart?.items?.[productId];
    if (!item) return;

    const currentQuantity = item.quantity || 0;
    const quantityInBranch =
      typeof item.data?.quantityInBranch === "number"
        ? item.data.quantityInBranch
        : undefined;

    if (
      action === "PLUS" &&
      quantityInBranch !== undefined &&
      currentQuantity >= quantityInBranch
    ) {
      return;
    }

    const total = action === "MINUS" ? -1 : 1;

    const unitPrice = Number(
      item.data?.basePrice ||
        item.data?.price ||
        (item.data as any)?.productPrice ||
        0
    );
    const priceChange = total * unitPrice;

    const newCart = { ...cart };
    if (!newCart[restaurantId]) {
      newCart[restaurantId] = {
        sum: 0,
        quantity: 0,
        items: {},
      };
    }

    newCart[restaurantId].sum = (newCart[restaurantId].sum || 0) + priceChange;
    newCart[restaurantId].quantity =
      (newCart[restaurantId].quantity || 0) + total;

    const newQuantity = currentQuantity + total;

    if (newQuantity <= 0) {
      delete newCart[restaurantId].items[productId];
      if (Object.keys(newCart[restaurantId].items).length === 0) {
        delete newCart[restaurantId];
      }
    } else {
      newCart[restaurantId].items[productId] = {
        ...item,
        quantity: newQuantity,
      };
    }

    setCart(newCart);
  };

  const getItemQuantity = (productId: string) =>
    getItemQuantityUtil(cart, restaurantId, productId);

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <HeaderHome pageName="cartPage" />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {isCartEmpty ? (
          <View
            style={{
              paddingVertical: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.regular,
                color: APP_COLOR.BROWN,
              }}
            >
              Chưa có món nào trong giỏ hàng.
            </Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <ItemCart
              key={item.id}
              image={item.image}
              title={item.title}
              quantity={item.quantity}
              price={item.price}
              description={item.description}
              productId={item.productId}
              handleQuantityChange={handleQuantityChange}
              getItemQuantity={getItemQuantity}
              unitPrice={item.unitPrice}
              quantityInBranch={item.quantityInBranch}
            />
          ))
        )}
      </ScrollView>
      <View
        style={{
          flex: 0.55,
          justifyContent: "flex-start",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: APP_COLOR.BROWN,
          padding: 10,
          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginLeft: 10,
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: APP_COLOR.BROWN,
              textTransform: "uppercase",
              fontSize: 18,
            }}
          >
            Giao hàng
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: APP_COLOR.BROWN,
            padding: 10,
            borderRadius: 10,
            justifyContent: "space-between",
            width: "90%",
            marginHorizontal: "auto",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontFamily: FONTS.regular, color: APP_COLOR.BROWN }}>
            {shippingAddress}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: APP_COLOR.BROWN,
              fontSize: 18,
            }}
          >
            Tổng cộng:
          </Text>
          <Text
            style={{
              fontFamily: FONTS.bold,
              color: APP_COLOR.ORANGE,
              fontSize: 24,
            }}
          >
            {currencyFormatter(totalAmount || 0)}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: "auto",
            marginBottom: 50,
          }}
        >
          <ShareButton
            title="Tiến hành đặt hàng"
            onPress={() => {
              if (appState) {
                handleCheckout();
              } else {
                router.navigate("/(auth)/welcome");
                Toast.show("Vui lòng đăng nhập để tiến hành đặt hàng", {
                  duration: Toast.durations.LONG,
                  textColor: "white",
                  backgroundColor: APP_COLOR.CANCEL,
                  opacity: 1,
                  position: 30,
                });
              }
            }}
            btnStyle={{
              width: 300,
              justifyContent: "center",
              opacity: isCartEmpty ? 0.5 : 1,
            }}
            textStyle={{
              color: APP_COLOR.WHITE,
              textTransform: "uppercase",
              fontFamily: FONTS.bold,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CartPage;
