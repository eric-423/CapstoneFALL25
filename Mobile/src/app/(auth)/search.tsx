import React, { useCallback, useState } from "react";
import { APP_COLOR } from "@/utils/constant";
import debounce from "debounce";
import {
  Image,
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";
import {
  currencyFormatter,
  calculateTotalQuantity,
  calculateTotalPrice,
} from "@/utils/cart";
import { getItemQuantity as getItemQuantityUtil } from "@/utils/cart";
import { SearchProductByName } from "@/utils/api";
import { router } from "expo-router";

interface IProduct {
  productId: string;
  description: string;
  price: number;
  image: any;
  name: string;
  averageRating: number;
  ProductType: {
    name: string;
    productTypeId: number;
  };
  productPrice?: number;
  productName?: string;
  productDescription?: string;
}

const SearchPage = () => {
  const { branchId, restaurant } = useCurrentApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const fallbackImage = require("@/assets/icons/com-tam.png");
  const comboFallbackImage = require("@/assets/saleoff/combo.png");
  const { cart, setCart } = useCurrentApp();

  // Tính toán số lượng và danh sách sản phẩm trong cart
  const restaurantId = restaurant?._id || `branch_${branchId || "default"}`;
  const restaurantCart = cart?.[restaurantId];
  const cartQuantity = restaurantCart
    ? calculateTotalQuantity(cart, restaurantId)
    : 0;
  const cartTotal = restaurantCart
    ? calculateTotalPrice(cart, restaurantId)
    : 0;

  const cartItems = restaurantCart?.items
    ? Object.entries(restaurantCart.items).map(([key, item]: any) => {
        const data = item?.data || {};
        const unitPrice =
          Number(data.basePrice || data.price || data.productPrice || 0) || 0;
        const isCombo = data.isCombo || false;
        const defaultImage = isCombo ? comboFallbackImage : fallbackImage;
        const imageSource =
          typeof data.image === "string" && data.image.trim() !== ""
            ? { uri: data.image }
            : data.image || defaultImage;
        return {
          id: key,
          image: imageSource,
          title: data.title || data.name || data.productName || "Sản phẩm",
          quantity: item?.quantity || 0,
          price: unitPrice * (item?.quantity || 0),
          unitPrice: unitPrice,
        };
      })
    : [];
  const fetchProducts = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        setProducts([]);
        setError(null);
        return;
      }
      if (!branchId) {
        setError("Vui lòng chọn chi nhánh");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await SearchProductByName(branchId, text);
        const apiProducts = res?.data?.content || res?.data?.data || [];
        const mappedProducts: IProduct[] = apiProducts.map((p: any) => {
          const isCombo = p.isCombo || p.comboId || false;
          const defaultImage = isCombo ? comboFallbackImage : fallbackImage;
          return {
            productId: String(p.productId),
            description: p.productDescription || p.productName || "",
            price: p.productPrice || 0,
            image:
              typeof p.productImage === "string" && p.productImage.trim() !== ""
                ? { uri: p.productImage }
                : defaultImage,
            name: p.productName || "",
            averageRating: 4.5,
            ProductType: {
              name: p.productType || "",
              productTypeId: p.productTypeId || 0,
            },
            productPrice: p.productPrice || 0,
            productName: p.productName || "",
            productDescription: p.productDescription || "",
          };
        });
        setProducts(mappedProducts);
      } catch (err: any) {
        console.error("Error searching products:", err);
        setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [branchId]
  );
  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    fetchProducts(text);
  };
  const handleQuantityChange = (
    item: IProduct & { productPrice?: number; productName?: string },
    action: "MINUS" | "PLUS"
  ) => {
    if (!restaurant?._id) {
      const mockRestaurant = { _id: `branch_${branchId || "default"}` };
      if (!cart[mockRestaurant._id]) {
        setCart({
          ...cart,
          [mockRestaurant._id]: {
            sum: 0,
            quantity: 0,
            items: {},
          },
        });
      }
    }

    const restaurantId = restaurant?._id || `branch_${branchId || "default"}`;
    const total = action === "MINUS" ? -1 : 1;
    const productPrice = item.productPrice || item.price || 0;
    const priceChange = total * productPrice;

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

    if (!newCart[restaurantId].items[item.productId]) {
      newCart[restaurantId].items[item.productId] = {
        data: {
          ProductType: item.ProductType,
          name: item.productName || item.name,
          productId: item.productId,
          image: item.image,
          description: item.description || item.productDescription || "",
          price: productPrice,
          basePrice: productPrice,
          title: item.productName || item.name,
        },
        quantity: 0,
      };
    }
    const currentQuantity =
      (newCart[restaurantId].items[item.productId].quantity || 0) + total;

    if (currentQuantity <= 0) {
      delete newCart[restaurantId].items[item.productId];
      if (Object.keys(newCart[restaurantId].items).length === 0) {
        delete newCart[restaurantId];
      }
    } else {
      newCart[restaurantId].items[item.productId] = {
        data: {
          ProductType: item.ProductType,
          name: item.productName || item.name,
          productId: item.productId,
          image: item.image,
          description: item.description || item.productDescription || "",
          price: productPrice,
          basePrice: productPrice,
          title: item.productName || item.name,
        },
        quantity: currentQuantity,
      };
    }
    setCart(newCart);
  };
  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color={APP_COLOR.BROWN} />
            <TextInput
              placeholder="Hôm nay bạn muốn ăn gì nào?"
              style={styles.input}
              onChangeText={handleChangeText}
              value={searchTerm}
              placeholderTextColor={APP_COLOR.BROWN}
            />
          </View>
          <View style={{ position: "relative" }}>
            <Pressable
              onPress={() => {
                setIsCartDropdownOpen(!isCartDropdownOpen);
              }}
              style={styles.notificationWrapper}
            >
              <SimpleLineIcons
                name="handbag"
                size={24}
                color={APP_COLOR.WHITE}
              />
              {cartQuantity > 0 && (
                <View
                  style={{
                    backgroundColor: APP_COLOR.ORANGE,
                    width: 25,
                    height: 25,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    left: 30,
                    top: -5,
                  }}
                >
                  <Text
                    style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
                  >
                    {cartQuantity}
                  </Text>
                </View>
              )}
            </Pressable>
            {isCartDropdownOpen && (
              <View style={styles.cartDropdownMenu}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: APP_COLOR.BACKGROUND_ORANGE,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 18,
                      color: APP_COLOR.BROWN,
                    }}
                  >
                    Giỏ hàng ({cartQuantity})
                  </Text>
                  <Pressable
                    onPress={() => setIsCartDropdownOpen(false)}
                    style={{ padding: 5 }}
                  >
                    <AntDesign name="close" size={20} color={APP_COLOR.BROWN} />
                  </Pressable>
                </View>
                {cartItems.length === 0 ? (
                  <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>
                      Chưa có sản phẩm nào trong giỏ hàng
                    </Text>
                  </View>
                ) : (
                  <>
                    <ScrollView
                      style={{ maxHeight: 300 }}
                      nestedScrollEnabled={true}
                    >
                      {cartItems.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                          <Image
                            source={item.image}
                            style={styles.cartItemImage}
                            resizeMode="cover"
                          />
                          <View style={styles.cartItemContent}>
                            <Text
                              style={styles.cartItemTitle}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Text style={styles.cartItemQuantity}>
                                SL: {item.quantity}
                              </Text>
                              <Text style={styles.cartItemPrice}>
                                {currencyFormatter(item.price)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                    <View
                      style={{
                        padding: 15,
                        borderTopWidth: 1,
                        borderTopColor: APP_COLOR.BACKGROUND_ORANGE,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 16,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          Tổng cộng:
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 18,
                            color: APP_COLOR.ORANGE,
                          }}
                        >
                          {currencyFormatter(cartTotal)}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setIsCartDropdownOpen(false);
                          router.navigate("/(user)/order/cart");
                        }}
                        style={{
                          backgroundColor: APP_COLOR.ORANGE,
                          paddingVertical: 12,
                          paddingHorizontal: 20,
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 16,
                            color: APP_COLOR.WHITE,
                          }}
                        >
                          Xem giỏ hàng
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
      <Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: 20,
          color: APP_COLOR.BROWN,
          marginHorizontal: 10,
          marginBottom: 10,
        }}
      >
        Kết quả tìm kiếm ({products.length})
      </Text>
      {loading && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
        </View>
      )}
      {error && (
        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 14,
              color: APP_COLOR.CANCEL,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </View>
      )}
      {!loading && !error && products.length === 0 && searchTerm.trim() && (
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 16,
              color: APP_COLOR.BROWN,
              textAlign: "center",
            }}
          >
            Không tìm thấy sản phẩm nào
          </Text>
        </View>
      )}
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const quantity = getItemQuantity(item.productId);
          const isLastItem = index === products.length - 1;
          return (
            <Pressable>
              <View
                style={[
                  styles.itemContainer,
                  { marginRight: isLastItem ? 10 : 5 },
                ]}
              >
                <Image
                  style={styles.itemImage}
                  source={
                    typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image
                  }
                />
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.averageRating}</Text>
                  <AntDesign name="star" size={15} color={APP_COLOR.ORANGE} />
                </View>
                <View style={styles.itemTextContainer}>
                  <View style={{ height: 50 }}>
                    <Text
                      style={[styles.itemName]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 13,
                        color: APP_COLOR.BROWN,
                      }}
                    >
                      - {item.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Text style={styles.itemPrice}>
                      {currencyFormatter(item.price)}
                    </Text>
                  </View>
                </View>
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={() => handleQuantityChange(item, "MINUS")}
                    style={({ pressed }) => ({
                      opacity:
                        getItemQuantity(item.productId) > 0
                          ? pressed
                            ? 0.5
                            : 1
                          : 0.3,
                    })}
                    disabled={getItemQuantity(item.productId) === 0}
                  >
                    <AntDesign
                      name="minus-circle"
                      size={20}
                      color={
                        getItemQuantity(item.productId) > 0
                          ? APP_COLOR.BUTTON_YELLOW
                          : APP_COLOR.BROWN
                      }
                    />
                  </Pressable>
                  <Text style={styles.quantityText}>
                    {getItemQuantity(item.productId)}
                  </Text>
                  <Pressable
                    onPress={() => handleQuantityChange(item, "PLUS")}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.5 : 1,
                    })}
                  >
                    <AntDesign
                      name="plus-circle"
                      size={20}
                      color={APP_COLOR.BUTTON_YELLOW}
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 30,
    width: "80%",
    height: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    alignSelf: "center",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: APP_COLOR.WHITE,
    height: 130,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    padding: 10,
  },
  itemImage: {
    height: 130,
    width: 130,
    borderRadius: 8,
    resizeMode: "cover",
  },
  ratingContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginRight: 2,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
  },
  itemPrice: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  quantityContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    gap: 2,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    minWidth: 25,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
  },
  notificationWrapper: {
    backgroundColor: APP_COLOR.BROWN,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  cartDropdownMenu: {
    position: "absolute",
    top: 60,
    right: 0,
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 12,
    width: 320,
    maxHeight: 450,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyCartContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyCartText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.GRAY,
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
  },
  cartItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  cartItemTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginBottom: 4,
  },
  cartItemQuantity: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: APP_COLOR.GRAY,
  },
  cartItemPrice: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: APP_COLOR.ORANGE,
  },
});

export default SearchPage;
