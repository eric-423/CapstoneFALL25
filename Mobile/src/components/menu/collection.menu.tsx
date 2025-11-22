import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { useEffect, useState, createContext, useContext } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCurrentApp } from "@/context/app.context";
import {
  getItemQuantity as getItemQuantityUtil,
  currencyFormatter,
} from "@/utils/cart";
import React from "react";
import { FONTS } from "@/theme/typography";
import {
  GetProductByProductType,
  GetCombo,
  SortProductByPrice,
} from "@/utils/api";
import { router } from "expo-router";
const { width: sWidth } = Dimensions.get("window");
const comboPlaceholder = require("@/assets/splash.png");

interface IProps {
  part?: "product" | "combo";
  name?: string;
  id?: number;
  branchId: number;
}

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
  isCombo?: boolean;
  comboId?: number;
  branchName?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
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
    if (action === "PLUS" && item.ProductType.productTypeId === 1) {
      router.navigate({
        pathname: "/order/add.extra.food",
        params: {
          productName: item.name,
          productTypeId: item.ProductType.productTypeId,
          productId: item.productId,
          productPrice: String(item.price),
        },
      });
    }

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

const CollectionMenu = (props: IProps) => {
  const { name, id, branchId, part = "product" } = props;
  const {
    cart,
    restaurant,
    setRestaurant,
    selectedProductTypeId,
    sortDirection,
  } = useCurrentApp();
  const { handleQuantityChange } = useModal();
  const [restaurants, setRestaurants] = useState<IPropsProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const mockRestaurant = {
    _id: "mock_restaurant_1",
    name: "Số món đã đặt",
    menu: [],
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (part === "combo") {
          const res = await GetCombo(branchId);
          const combos = res?.data?.content || [];
          let mappedCombos: IPropsProduct[] = combos.map((combo: any) => ({
            ProductType: {
              name: combo.branchName || "Combo",
              productTypeId: -1,
            },
            productDescription: combo.description || "",
            name: combo.name,
            productId: `combo_${combo.comboId}`,
            image: combo.imageUrl || comboPlaceholder,
            description: combo.description || "",
            price: combo.price || 0,
            averageRating: 5,
            isCombo: true,
            comboId: combo.comboId,
            branchName: combo.branchName,
            startDate: combo.startDate,
            endDate: combo.endDate,
            active: combo.active,
          }));
          if (sortDirection) {
            mappedCombos = mappedCombos.sort((a, b) => {
              if (sortDirection === "ASC") {
                return a.price - b.price;
              } else {
                return b.price - a.price;
              }
            });
          }
          setRestaurants(mappedCombos);
        } else {
          if (selectedProductTypeId === null && sortDirection && branchId) {
            const res = await SortProductByPrice(branchId, sortDirection);
            const mapped: IPropsProduct[] = (res?.data?.content || []).map(
              (p: any) => ({
                ProductType: {
                  name: p.productType,
                  productTypeId: p.productTypeId,
                },
                productDescription: p.productDescription,
                name: p.productName,
                productId: String(p.productId),
                image: p.productImage,
                description: p.productDescription,
                price: p.productPrice,
                averageRating: 5,
              })
            );
            setRestaurants(mapped);
          } else {
            const res = await GetProductByProductType(branchId, id || 0);
            let mapped: IPropsProduct[] = (res?.data?.content || []).map(
              (p: any) => ({
                ProductType: {
                  name: p.productType,
                  productTypeId: p.productTypeId,
                },
                productDescription: p.productDescription,
                name: p.productName,
                productId: String(p.productId),
                image: p.productImage,
                description: p.productDescription,
                price: p.productPrice,
                averageRating: 5,
              })
            );
            if (sortDirection) {
              mapped = mapped.sort((a, b) => {
                if (sortDirection === "ASC") {
                  return a.price - b.price;
                } else {
                  return b.price - a.price;
                }
              });
            }
            setRestaurants(mapped);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, branchId, part, selectedProductTypeId, sortDirection]);

  useEffect(() => {
    if (!restaurant) {
      setRestaurant(mockRestaurant);
    }
  }, [restaurant, setRestaurant]);

  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);

  return (
    <>
      <View style={styles.spacer} />
      {part === "combo" ? (
        loading ? (
          <ContentLoader
            speed={2}
            width={sWidth}
            height={360}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={styles.loader}
          >
            <Rect x="5" y="5" rx="10" ry="10" width="370" height="110" />
            <Rect x="10" y="10" rx="10" ry="10" width="100" height="100" />
            <Rect x="120" y="15" rx="6" ry="6" width="230" height="18" />
            <Rect x="120" y="40" rx="6" ry="6" width="200" height="14" />
            <Rect x="120" y="82" rx="6" ry="6" width="110" height="20" />
            <Rect x="235" y="86" rx="6" ry="6" width="90" height="12" />
            <Rect x="345" y="0" rx="10" ry="10" width="30" height="20" />
            <Rect x="285" y="80" rx="12" ry="12" width="26" height="26" />
            <Rect x="315" y="80" rx="12" ry="12" width="28" height="26" />
            <Rect x="345" y="80" rx="12" ry="12" width="26" height="26" />
            <Rect x="5" y="125" rx="10" ry="10" width="370" height="110" />
            <Rect x="10" y="130" rx="10" ry="10" width="100" height="100" />
            <Rect x="120" y="135" rx="6" ry="6" width="230" height="18" />
            <Rect x="120" y="160" rx="6" ry="6" width="200" height="14" />
            <Rect x="120" y="202" rx="6" ry="6" width="110" height="20" />
            <Rect x="235" y="206" rx="6" ry="6" width="90" height="12" />
            <Rect x="345" y="120" rx="10" ry="10" width="30" height="20" />
            <Rect x="285" y="200" rx="12" ry="12" width="26" height="26" />
            <Rect x="315" y="200" rx="12" ry="12" width="28" height="26" />
            <Rect x="345" y="200" rx="12" ry="12" width="26" height="26" />
            <Rect x="5" y="245" rx="10" ry="10" width="370" height="110" />
            <Rect x="10" y="250" rx="10" ry="10" width="100" height="100" />
            <Rect x="120" y="255" rx="6" ry="6" width="230" height="18" />
            <Rect x="120" y="280" rx="6" ry="6" width="200" height="14" />
            <Rect x="120" y="322" rx="6" ry="6" width="110" height="20" />
            <Rect x="235" y="326" rx="6" ry="6" width="90" height="12" />
            <Rect x="345" y="240" rx="10" ry="10" width="30" height="20" />
            <Rect x="285" y="320" rx="12" ry="12" width="26" height="26" />
            <Rect x="315" y="320" rx="12" ry="12" width="28" height="26" />
            <Rect x="345" y="320" rx="12" ry="12" width="26" height="26" />
          </ContentLoader>
        ) : (
          <View style={styles.container}>
            <Pressable
              onPress={() => console.log("hihi")}
              style={styles.headerContainer}
            >
              <Text style={styles.headerText}>{name || "Combo"}</Text>
            </Pressable>
            <FlatList
              data={restaurants}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <View
                  style={{
                    paddingVertical: 10,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: APP_COLOR.BROWN,
                      fontFamily: FONTS.regular,
                      textAlign: "center",
                    }}
                  >
                    Không có combo.
                  </Text>
                </View>
              )}
              renderItem={({
                item,
                index,
              }: {
                item: IPropsProduct;
                index: number;
              }) => {
                const isLastItem = index === restaurants.length - 1;
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
                            : (item.image as any)
                        }
                      />
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>
                          {item.averageRating}
                        </Text>
                        <AntDesign
                          name="star"
                          size={15}
                          color={APP_COLOR.ORANGE}
                        />
                      </View>
                      <View style={styles.itemTextContainer}>
                        <View style={{ height: 50 }}>
                          <Text
                            style={[styles.itemName]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.name}
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
                          <Text
                            style={[
                              styles.itemPrice,
                              {
                                textDecorationLine: "line-through",
                                fontFamily: FONTS.regular,
                                fontSize: 13,
                                color: APP_COLOR.BROWN,
                                position: "relative",
                                bottom: -20,
                              },
                            ]}
                          >
                            {currencyFormatter(item.price - 3000)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.quantityContainer,
                          { marginHorizontal: 10, marginVertical: 10 },
                        ]}
                      >
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
                            size={24}
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
                            size={24}
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
        )
      ) : selectedProductTypeId !== null &&
        selectedProductTypeId !== id ? null : loading ? (
        <ContentLoader
          speed={2}
          width={sWidth}
          height={360}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          style={styles.loader}
        >
          <Rect x="5" y="5" rx="10" ry="10" width="370" height="110" />

          <Rect x="10" y="10" rx="10" ry="10" width="100" height="100" />

          <Rect x="120" y="15" rx="6" ry="6" width="230" height="18" />
          <Rect x="120" y="40" rx="6" ry="6" width="200" height="14" />

          <Rect x="120" y="82" rx="6" ry="6" width="110" height="20" />
          <Rect x="235" y="86" rx="6" ry="6" width="90" height="12" />

          <Rect x="345" y="0" rx="10" ry="10" width="30" height="20" />

          <Rect x="285" y="80" rx="12" ry="12" width="26" height="26" />
          <Rect x="315" y="80" rx="12" ry="12" width="28" height="26" />
          <Rect x="345" y="80" rx="12" ry="12" width="26" height="26" />

          <Rect x="5" y="125" rx="10" ry="10" width="370" height="110" />
          <Rect x="10" y="130" rx="10" ry="10" width="100" height="100" />
          <Rect x="120" y="135" rx="6" ry="6" width="230" height="18" />
          <Rect x="120" y="160" rx="6" ry="6" width="200" height="14" />
          <Rect x="120" y="202" rx="6" ry="6" width="110" height="20" />
          <Rect x="235" y="206" rx="6" ry="6" width="90" height="12" />
          <Rect x="345" y="120" rx="10" ry="10" width="30" height="20" />
          <Rect x="285" y="200" rx="12" ry="12" width="26" height="26" />
          <Rect x="315" y="200" rx="12" ry="12" width="28" height="26" />
          <Rect x="345" y="200" rx="12" ry="12" width="26" height="26" />

          <Rect x="5" y="245" rx="10" ry="10" width="370" height="110" />
          <Rect x="10" y="250" rx="10" ry="10" width="100" height="100" />
          <Rect x="120" y="255" rx="6" ry="6" width="230" height="18" />
          <Rect x="120" y="280" rx="6" ry="6" width="200" height="14" />
          <Rect x="120" y="322" rx="6" ry="6" width="110" height="20" />
          <Rect x="235" y="326" rx="6" ry="6" width="90" height="12" />
          <Rect x="345" y="240" rx="10" ry="10" width="30" height="20" />
          <Rect x="285" y="320" rx="12" ry="12" width="26" height="26" />
          <Rect x="315" y="320" rx="12" ry="12" width="28" height="26" />
          <Rect x="345" y="320" rx="12" ry="12" width="26" height="26" />
        </ContentLoader>
      ) : (
        <View style={styles.container}>
          <Text style={styles.headerText}>{name}</Text>
          <FlatList
            data={restaurants}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  paddingVertical: 10,
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: APP_COLOR.BROWN,
                    fontFamily: FONTS.regular,
                    textAlign: "center",
                  }}
                >
                  Không có sản phẩm.
                </Text>
              </View>
            )}
            renderItem={({
              item,
              index,
            }: {
              item: IPropsProduct;
              index: number;
            }) => {
              const isLastItem = index === restaurants.length - 1;
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
                          : (item.image as any)
                      }
                    />
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>
                        {item.averageRating}
                      </Text>
                      <AntDesign
                        name="star"
                        size={15}
                        color={APP_COLOR.ORANGE}
                      />
                    </View>
                    <View style={styles.itemTextContainer}>
                      <View style={{ height: 50 }}>
                        <Text
                          style={[styles.itemName]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.name}
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
                        <Text
                          style={[
                            styles.itemPrice,
                            {
                              textDecorationLine: "line-through",
                              fontFamily: FONTS.regular,
                              fontSize: 13,
                              color: APP_COLOR.BROWN,
                              position: "relative",
                              bottom: -20,
                            },
                          ]}
                        >
                          {currencyFormatter(item.price - 3000)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.quantityContainer,
                        { marginHorizontal: 10, marginVertical: 10 },
                      ]}
                    >
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
                          size={24}
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
                          size={24}
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  spacer: {
    height: 10,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  viewAllContainer: {
    position: "absolute",
    flexDirection: "row",
    right: 3,
  },
  viewAllText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.medium,
    fontSize: 17,
  },
  navigateIcon: {
    marginTop: 2,
  },
  flatListContent: {
    gap: 7,
    paddingRight: 10,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: APP_COLOR.WHITE,
    width: 355,
    height: 100,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 5,
    gap: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
    opacity: 0.85,
  },
  ratingContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    flexDirection: "row",
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    opacity: 0.8,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  ratingText: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  itemTextContainer: {
    padding: 5,
  },
  itemName: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: APP_COLOR.BROWN,
  },
  itemPrice: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.bold,
    fontSize: 17,
  },
  quantityContainer: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 50,
    marginBottom: 7,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    position: "absolute",
    bottom: 10,
    right: 0,
  },
  quantityText: {
    minWidth: 25,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    justifyContent: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 700,
    overflow: "hidden",
  },
  modalCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1000,
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
  },
  modalProductName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    marginTop: 5,
    marginHorizontal: 10,
  },
  modalProductPrice: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: APP_COLOR.ORANGE,
    textAlign: "center",
  },
  loader: {
    width: "100%",
  },
});

export default CollectionMenu;
