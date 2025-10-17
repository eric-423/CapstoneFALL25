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
const { width: sWidth } = Dimensions.get("window");

interface IProps {
  name: string;
  id: number;
  branchId: number | null;
}

interface IPropsProduct {
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
  showProductModal: (item: IPropsProduct) => void;
  hideProductModal: () => void;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPropsProduct | null>(null);
  const [typeProducts, setTypeProducts] = useState([]);
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

  const showProductModal = (item: IPropsProduct) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const hideProductModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleQuantityChange = (
    item: IPropsProduct,
    action: "MINUS" | "PLUS"
  ) => {
    if (action === "PLUS" && item.ProductType.productTypeId === 1) {
      showProductModal(item);
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
        } as ICartItem,
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
        } as ICartItem,
        quantity: currentQuantity,
      };
    }
    setCart(newCart);
  };

  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);

  // useEffect(() => {
  //   const fetchTypeProducts = async () => {
  //     try {
  //       const typePro = await axios.get(`${API_URL}/api/products/type/3`);
  //       setTypeProducts(typePro.data.products);
  //     } catch (error) {
  //       console.error("Error fetching product types:", error);
  //     }
  //   };
  //   fetchTypeProducts();
  // }, []);

  return (
    <ModalContext.Provider
      value={{ showProductModal, hideProductModal, handleQuantityChange }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const CollectionMenu = (props: IProps) => {
  const { name, id } = props;
  const { cart, restaurant, setRestaurant } = useCurrentApp();
  const { handleQuantityChange } = useModal();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const mockRestaurant = {
    _id: "mock_restaurant_1",
    name: "Số món đã đặt",
    menu: [],
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(`${API_URL}/api/products/type/${props.id}`);
  //       console.log(res);

  //       setRestaurants(res.data.products);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy dữ liệu:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id, branchId]);

  useEffect(() => {
    if (!restaurant) {
      setRestaurant(mockRestaurant);
    }
  }, [restaurant, setRestaurant]);
  const MOCK_BY_TYPE: Record<number, IPropsProduct[]> = {
    1: [
      {
        ProductType: { name: "Đồ ăn", productTypeId: 1 },
        name: "Cơm tấm sườn bì chả",
        productId: "food_1",
        image: require("@/assets/icons/com-tam.png"),
        description: "Cơm tấm sườn bì chả",
        price: 45000,
        averageRating: 4.6,
      },
      {
        ProductType: { name: "Đồ ăn", productTypeId: 1 },
        name: "Bún bò Huế",
        productId: "food_2",
        image: require("@/assets/icons/com-tam.png"),
        description: "Bún bò Huế",
        price: 42000,
        averageRating: 4.3,
      },
      {
        ProductType: { name: "Đồ ăn", productTypeId: 1 },
        name: "Phở bò tái",
        productId: "food_3",
        image: require("@/assets/icons/com-tam.png"),
        description: "Phở bò tái",
        price: 40000,
        averageRating: 4.7,
      },
    ],
    2: [
      {
        ProductType: { name: "Đồ uống", productTypeId: 2 },
        name: "Cà phê sữa đá",
        productId: "drink_1",
        image: require("@/assets/icons/com-tam.png"),
        description: "Cà phê sữa đá",
        price: 25000,
        averageRating: 4.5,
      },
      {
        ProductType: { name: "Đồ uống", productTypeId: 2 },
        name: "Trà sữa trân châu",
        productId: "drink_2",
        image: require("@/assets/icons/com-tam.png"),
        description: "Trà sữa trân châu",
        price: 35000,
        averageRating: 4.1,
      },
      {
        ProductType: { name: "Đồ uống", productTypeId: 2 },
        name: "Nước cam",
        productId: "drink_3",
        image: require("@/assets/icons/com-tam.png"),
        description: "Nước cam",
        price: 28000,
        averageRating: 4.2,
      },
    ],
    3: [
      {
        ProductType: { name: "Món thêm", productTypeId: 3 },
        name: "Trứng ốp la",
        productId: "extra_1",
        image: require("@/assets/icons/com-tam.png"),
        description: "Trứng ốp la",
        price: 10000,
        averageRating: 4.0,
      },
      {
        ProductType: { name: "Món thêm", productTypeId: 3 },
        name: "Chả lụa",
        productId: "extra_2",
        image: require("@/assets/icons/com-tam.png"),
        description: "Chả lụa",
        price: 8000,
        averageRating: 4.1,
      },
    ],
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const list = MOCK_BY_TYPE[id] || [];
      setRestaurants(list as unknown as never[]);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [id]);
  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);

  return (
    <>
      <View style={styles.spacer} />
      {loading ? (
        <ContentLoader
          speed={2}
          width={sWidth}
          height={230}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          style={styles.loader}
        >
          <Rect x="10" y="10" rx="5" ry="5" width={150} height="200" />
          <Rect x="170" y="10" rx="5" ry="5" width={150} height="200" />
          <Rect x="330" y="10" rx="5" ry="5" width={150} height="200" />
        </ContentLoader>
      ) : (
        <View style={styles.container}>
          <Pressable
            onPress={() =>
              // router.navigate({
              //   pathname: "/(auth)/restaurants",
              //   params: { id },
              // })
              console.log("hihi")
            }
            style={styles.headerContainer}
          >
            <Text style={styles.headerText}>{name}</Text>
            <View style={styles.viewAllContainer}>
              <Text style={styles.viewAllText}>Xem tất cả &gt;</Text>
            </View>
          </Pressable>

          <FlatList
            data={restaurants}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({
              item,
              index,
            }: {
              item: IPropsProduct;
              index: number;
            }) => {
              const quantity = getItemQuantity(item.productId);
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
                          {item.description}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 13,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          - Cơm Tấm Sườn Chả
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
                              bottom: -10,
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
    padding: 10,
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
    width: 370,
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
    marginBottom: 5,
    textAlign: "center",
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
