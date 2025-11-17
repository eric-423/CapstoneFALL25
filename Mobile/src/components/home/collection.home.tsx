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
import { TopSellingProduct } from "@/utils/api";
const { width: sWidth } = Dimensions.get("window");

interface IProps {
  name: string;
  id: number;
  branchId: number | null;
}

interface IPropsProduct {
  id: number;
  name: string;
  quantitySold: number;
  revenue: number;
  type: string;
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
    <ModalContext.Provider value={{ showProductModal, hideProductModal }}>
      {children}
    </ModalContext.Provider>
  );
};

const CollectionHome = (props: IProps) => {
  const { name } = props;
  const { cart, restaurant, setRestaurant, branchId } = useCurrentApp();
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await TopSellingProduct(branchId as number);
      setRestaurants(res.data.data.topItems as unknown as never[]);
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    };
    fetchData();
  }, [branchId]);
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
            horizontal
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
                          style={[styles.itemName, { maxWidth: 130 }]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                      </View>

                      <Text style={styles.itemQuantitySold}>
                        Đã bán {item.quantitySold} món
                      </Text>
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
    width: 150,
    height: 220,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
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
    height: 120,
    width: 140,
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
  itemQuantitySold: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    position: "relative",
    bottom: 10,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 50,
    marginBottom: 7,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    marginHorizontal: "auto",
  },
  quantityText: {
    minWidth: 25,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
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

export default CollectionHome;
