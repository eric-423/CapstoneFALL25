import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  TextInput,
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
  GetComboDetail,
} from "@/utils/api";
import { router } from "expo-router";
const { width: sWidth } = Dimensions.get("window");
const comboPlaceholder = require("@/assets/saleoff/combo.png");

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
  inStock?: boolean;
  quantityInBranch?: number;
}

interface ModalContextType {
  handleQuantityChange: (
    item: IPropsProduct,
    action: "MINUS" | "PLUS" | number
  ) => void;
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
    action: "MINUS" | "PLUS" | number
  ) => {
    if (!restaurant?._id) return;

    const limit =
      item.quantityInBranch !== undefined && item.quantityInBranch !== null
        ? item.quantityInBranch
        : undefined;

    let total: number;
    let newQuantity: number;
    const currentQuantity =
      cart?.[restaurant._id]?.items?.[item.productId]?.quantity || 0;

    if (typeof action === "number") {
      newQuantity = Math.max(0, Math.floor(action));
      total = newQuantity - currentQuantity;
    } else {
      total = action === "MINUS" ? -1 : 1;
      newQuantity = currentQuantity + total;

      if (action === "PLUS" && limit !== undefined && newQuantity > limit) {
        newQuantity = limit;
        total = newQuantity - currentQuantity;
        if (total <= 0) return;
      }

      if (
        action === "PLUS" &&
        item.ProductType.productTypeId === 1 &&
        newQuantity > 0
      ) {
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

        newCart[restaurant._id].items[item.productId] = {
          data: {
            ...item,
            basePrice: item.price,
            title: item.name,
          },
          quantity: newQuantity,
        };
        setCart(newCart);

        router.navigate({
          pathname: "/order/add.extra.food",
          params: {
            productId: item.productId,
          },
        });
        return;
      }
    }

    if (limit !== undefined && newQuantity > limit) {
      newQuantity = limit;
    }

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

    if (newQuantity <= 0) {
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
        quantity: newQuantity,
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
  const [expandedComboId, setExpandedComboId] = useState<number | null>(null);
  const [comboItemsMap, setComboItemsMap] = useState<
    Record<
      number,
      {
        productId: number;
        productName: string;
        quantity: number;
      }[]
    >
  >({});
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
            image:
              combo.imageUrl && combo.imageUrl.trim() !== ""
                ? combo.imageUrl
                : comboPlaceholder,
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
                inStock: p.inStock,
                productDescription: p.productDescription,
                name: p.productName,
                productId: String(p.productId),
                image: p.productImage,
                description: p.productDescription,
                price: p.productPrice,
                averageRating: 5,
                quantityInBranch: p.quantityInBranch,
              })
            );
            const grouped = mapped.reduce((acc, product) => {
              const typeId = product.ProductType.productTypeId;
              if (!acc[typeId]) {
                acc[typeId] = [];
              }
              acc[typeId].push(product);
              return acc;
            }, {} as Record<number, IPropsProduct[]>);
            const flattened: IPropsProduct[] = [];
            Object.keys(grouped)
              .sort((a, b) => Number(a) - Number(b))
              .forEach((typeId) => {
                const products = grouped[Number(typeId)];
                const sorted = products.sort((a, b) => {
                  if (sortDirection === "ASC") {
                    return a.price - b.price;
                  } else {
                    return b.price - a.price;
                  }
                });
                flattened.push(...sorted);
              });
            setRestaurants(flattened);
          } else {
            const res = await GetProductByProductType(
              branchId,
              id || 0,
              sortDirection || null
            );
            const mapped: IPropsProduct[] = (res?.data?.content || []).map(
              (p: any) => ({
                ProductType: {
                  name: p.productType,
                  productTypeId: p.productTypeId,
                },
                inStock: p.inStock,
                productDescription: p.productDescription,
                name: p.productName,
                productId: String(p.productId),
                image: p.productImage,
                description: p.productDescription,
                price: p.productPrice,
                averageRating: 5,
                quantityInBranch: p.quantityInBranch,
              })
            );
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
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{name || "Combo"}</Text>
            </View>
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
                  <View style={{ flexDirection: "column" }}>
                    <Pressable
                      disabled={item.inStock === false}
                      onPress={async () => {
                        if (!item.isCombo || !item.comboId) return;
                        const comboId = item.comboId;

                        if (expandedComboId === comboId) {
                          setExpandedComboId(null);
                          return;
                        }

                        if (!comboItemsMap[comboId]) {
                          try {
                            const res = await GetComboDetail(comboId);
                            console.log("res", res.data.data.comboItems);
                            const data = res?.data?.data;
                            const items =
                              (data?.comboItems || []).map((ci: any) => ({
                                productId: ci.productId,
                                productName:
                                  ci.productName || `Sản phẩm ${ci.productId}`,
                                quantity: ci.quantity ?? 0,
                              })) || [];

                            setComboItemsMap((prev) => ({
                              ...prev,
                              [comboId]: items,
                            }));
                          } catch (error) {
                            console.error("Lỗi lấy chi tiết combo:", error);
                          }
                        }

                        setExpandedComboId(comboId);
                      }}
                    >
                      <View
                        style={[
                          styles.itemContainer,
                          { marginRight: isLastItem ? 10 : 5 },
                          item.inStock === false &&
                            styles.itemContainerOutOfStock,
                        ]}
                      >
                        <View style={styles.imageWrapper}>
                          <Image
                            style={[
                              styles.itemImage,
                              item.inStock === false &&
                                styles.itemImageOutOfStock,
                            ]}
                            source={
                              typeof item.image === "string"
                                ? { uri: item.image }
                                : (item.image as any)
                            }
                          />
                          {item.inStock === false && (
                            <View style={styles.outOfStockOverlay} />
                          )}
                          {item.inStock === false && (
                            <View style={styles.outOfStockBanner}>
                              <Text style={styles.outOfStockText}>
                                HẾT HÀNG
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingText}>
                            {item.quantityInBranch !== undefined &&
                            item.quantityInBranch !== null
                              ? `Còn: ${item.quantityInBranch}`
                              : ""}
                          </Text>
                        </View>
                        <View style={styles.itemTextContainer}>
                          <View style={{ height: 50 }}>
                            <Text
                              style={[
                                styles.itemName,
                                item.inStock === false &&
                                  styles.itemNameOutOfStock,
                              ]}
                              numberOfLines={1}
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
                            <Text
                              style={[
                                styles.itemPrice,
                                item.inStock === false &&
                                  styles.itemPriceOutOfStock,
                              ]}
                            >
                              {currencyFormatter(item.price)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.quantityContainer,
                            { marginHorizontal: 10, marginVertical: 10 },
                            item.inStock === false &&
                              styles.quantityContainerDisabled,
                          ]}
                        >
                          <Pressable
                            onPress={() => handleQuantityChange(item, "MINUS")}
                            style={({ pressed }) => ({
                              opacity:
                                getItemQuantity(item.productId) > 0 &&
                                item.inStock !== false
                                  ? pressed
                                    ? 0.5
                                    : 1
                                  : 0.3,
                            })}
                            disabled={
                              getItemQuantity(item.productId) === 0 ||
                              item.inStock === false
                            }
                          >
                            <AntDesign
                              name="minus-circle"
                              size={24}
                              color={
                                getItemQuantity(item.productId) > 0 &&
                                item.inStock !== false
                                  ? APP_COLOR.BUTTON_YELLOW
                                  : APP_COLOR.BROWN
                              }
                            />
                          </Pressable>
                          <TextInput
                            style={styles.quantityText}
                            value={String(getItemQuantity(item.productId))}
                            onChangeText={(text) => {
                              const numValue = parseInt(text) || 0;
                              const finalValue = Math.max(0, numValue);
                              handleQuantityChange(item, finalValue);
                            }}
                            keyboardType="numeric"
                            editable={item.inStock !== false}
                            selectTextOnFocus
                          />
                          <Pressable
                            onPress={() => handleQuantityChange(item, "PLUS")}
                            style={({ pressed }) => {
                              const atLimit =
                                item.quantityInBranch !== undefined &&
                                getItemQuantity(item.productId) >=
                                  item.quantityInBranch;
                              const disabled =
                                item.inStock === false || atLimit;
                              return {
                                opacity: 1,
                                backgroundColor: disabled
                                  ? APP_COLOR.GRAY
                                  : "transparent",
                                borderRadius: 20,
                                padding: 2,
                                ...(pressed && !disabled
                                  ? { opacity: 0.5 }
                                  : {}),
                              };
                            }}
                            disabled={
                              item.inStock === false ||
                              (item.quantityInBranch !== undefined &&
                                getItemQuantity(item.productId) >=
                                  item.quantityInBranch)
                            }
                          >
                            <AntDesign
                              name="plus-circle"
                              size={24}
                              color={
                                item.inStock === false ||
                                (item.quantityInBranch !== undefined &&
                                  getItemQuantity(item.productId) >=
                                    item.quantityInBranch)
                                  ? APP_COLOR.GRAY
                                  : APP_COLOR.BUTTON_YELLOW
                              }
                            />
                          </Pressable>
                        </View>
                      </View>
                    </Pressable>
                    {item.isCombo &&
                      item.comboId &&
                      expandedComboId === item.comboId &&
                      comboItemsMap[item.comboId] && (
                        <View style={styles.comboDropdown}>
                          {(() => {
                            const items = comboItemsMap[item.comboId!];
                            return items.map((ci, idx) => (
                              <View key={ci.productId}>
                                <View style={styles.comboDropdownRow}>
                                  <View style={styles.comboDropdownItemLeft}>
                                    <View style={styles.comboDropdownBullet} />
                                    <Text style={styles.comboDropdownText}>
                                      {ci.productName}
                                    </Text>
                                  </View>
                                  <View
                                    style={styles.comboDropdownQuantityBadge}
                                  >
                                    <Text style={styles.comboDropdownQuantity}>
                                      x{ci.quantity}
                                    </Text>
                                  </View>
                                </View>
                                {idx < items.length - 1 && (
                                  <View style={styles.comboDropdownSeparator} />
                                )}
                              </View>
                            ));
                          })()}
                        </View>
                      )}
                  </View>
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
          {selectedProductTypeId === null ? null : (
            <Text style={styles.headerText}>{name}</Text>
          )}
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
              const showHeader =
                selectedProductTypeId === null &&
                (index === 0 ||
                  restaurants[index - 1].ProductType.productTypeId !==
                    item.ProductType.productTypeId);

              return (
                <>
                  {showHeader && (
                    <View style={styles.headerContainer}>
                      <Text style={styles.headerText}>
                        {item.ProductType.name}
                      </Text>
                    </View>
                  )}
                  <Pressable
                    disabled={item.inStock === false}
                    onPress={() => {
                      router.navigate({
                        pathname: "/(user)/products/[id]",
                        params: {
                          id: String(item.productId),
                          branchId: String(branchId),
                        },
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.itemContainer,
                        { marginRight: isLastItem ? 10 : 5 },
                        item.inStock === false &&
                          styles.itemContainerOutOfStock,
                      ]}
                    >
                      {item.inStock === false && (
                        <View style={styles.outOfStockBanner}>
                          <Text style={styles.outOfStockText}>HẾT HÀNG</Text>
                        </View>
                      )}
                      <View style={styles.imageWrapper}>
                        <Image
                          style={[
                            styles.itemImage,
                            item.inStock === false &&
                              styles.itemImageOutOfStock,
                          ]}
                          source={
                            typeof item.image === "string"
                              ? { uri: item.image }
                              : (item.image as any)
                          }
                        />
                        {item.inStock === false && (
                          <View style={styles.outOfStockOverlay} />
                        )}
                      </View>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>
                          {item.quantityInBranch !== undefined &&
                          item.quantityInBranch !== null
                            ? `Còn: ${item.quantityInBranch}`
                            : ""}
                        </Text>
                      </View>
                      <View style={styles.itemTextContainer}>
                        <View style={{ height: 50 }}>
                          <Text
                            style={[
                              styles.itemName,
                              item.inStock === false &&
                                styles.itemNameOutOfStock,
                            ]}
                            numberOfLines={1}
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
                          <Text
                            style={[
                              styles.itemPrice,
                              item.inStock === false &&
                                styles.itemPriceOutOfStock,
                            ]}
                          >
                            {currencyFormatter(item.price)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.quantityContainer,
                          { marginHorizontal: 10, marginVertical: 10 },
                          item.inStock === false &&
                            styles.quantityContainerDisabled,
                        ]}
                      >
                        <Pressable
                          onPress={() => handleQuantityChange(item, "MINUS")}
                          style={({ pressed }) => ({
                            opacity:
                              getItemQuantity(item.productId) > 0 &&
                              item.inStock !== false
                                ? pressed
                                  ? 0.5
                                  : 1
                                : 0.3,
                          })}
                          disabled={
                            getItemQuantity(item.productId) === 0 ||
                            item.inStock === false
                          }
                        >
                          <AntDesign
                            name="minus-circle"
                            size={24}
                            color={
                              getItemQuantity(item.productId) > 0 &&
                              item.inStock !== false
                                ? APP_COLOR.BUTTON_YELLOW
                                : APP_COLOR.BROWN
                            }
                          />
                        </Pressable>
                        <TextInput
                          style={styles.quantityText}
                          value={String(getItemQuantity(item.productId))}
                          onChangeText={(text) => {
                            const numValue = parseInt(text) || 0;
                            const finalValue = Math.max(0, numValue);
                            handleQuantityChange(item, finalValue);
                          }}
                          keyboardType="numeric"
                          editable={item.inStock !== false}
                          selectTextOnFocus
                        />
                        <Pressable
                          onPress={() => handleQuantityChange(item, "PLUS")}
                          style={({ pressed }) => {
                            const atLimit =
                              item.quantityInBranch !== undefined &&
                              item.quantityInBranch !== null &&
                              getItemQuantity(item.productId) >=
                                item.quantityInBranch;
                            const disabled = item.inStock === false || atLimit;
                            return {
                              opacity: disabled ? 0.3 : pressed ? 0.5 : 1,
                            };
                          }}
                          disabled={
                            item.inStock === false ||
                            (item.quantityInBranch !== undefined &&
                              item.quantityInBranch !== null &&
                              getItemQuantity(item.productId) >=
                                item.quantityInBranch)
                          }
                        >
                          <AntDesign
                            name="plus-circle"
                            size={24}
                            color={
                              item.inStock === false ||
                              (item.quantityInBranch !== undefined &&
                                item.quantityInBranch !== null &&
                                getItemQuantity(item.productId) >=
                                  item.quantityInBranch)
                                ? APP_COLOR.GRAY
                                : APP_COLOR.BUTTON_YELLOW
                            }
                          />
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                </>
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
    minHeight: 100,
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
    width: "70%",
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
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 50,
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
    padding: 0,
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
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  itemImageOutOfStock: {
    opacity: 0.4,
  },
  itemContainerOutOfStock: {
    opacity: 0.6,
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  outOfStockBanner: {
    position: "absolute",
    top: 25,
    left: 80,
    width: 200,
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    transform: [{ rotate: "-15deg" }],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },
  outOfStockText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.bold,
    fontSize: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  itemNameOutOfStock: {
    opacity: 0.5,
  },
  itemPriceOutOfStock: {
    opacity: 0.5,
  },
  quantityContainerDisabled: {
    opacity: 0.5,
  },
  comboDropdown: {
    marginBottom: 5,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: APP_COLOR.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    top: -20,
    zIndex: -1000,
    marginHorizontal: 5,
  },
  comboDropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  comboDropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  comboDropdownBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: APP_COLOR.ORANGE,
    marginRight: 10,
  },
  comboDropdownText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    fontSize: 14,
    flex: 1,
  },
  comboDropdownQuantityBadge: {
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  comboDropdownQuantity: {
    fontFamily: FONTS.semiBold,
    color: APP_COLOR.ORANGE,
    fontSize: 13,
  },
  comboDropdownSeparator: {
    height: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    marginVertical: 4,
    marginLeft: 16,
  },
});

export default CollectionMenu;
