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
  ScrollView,
} from "react-native";
import { FontAwesome, AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";
import { currencyFormatter } from "@/utils/cart";
import { getItemQuantity as getItemQuantityUtil } from "@/utils/cart";

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
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<IProduct[]>([
    {
      productId: "1",
      description: "Cơm tấm sườn nướng",
      price: 45000,
      image: require("@/assets/icons/com-tam.png"),
      name: "Cơm tấm sườn nướng",
      averageRating: 4.5,
      ProductType: {
        name: "Đồ ăn",
        productTypeId: 1,
      },
    },
    {
      productId: "2",
      description: "Canh chua cá bông lau",
      price: 35000,
      image: require("@/assets/icons/com-tam.png"),
      name: "Canh chua cá bông lau",
      averageRating: 4.2,
      ProductType: {
        name: "Món canh",
        productTypeId: 4,
      },
    },
    {
      productId: "3",
      description: "Coca Cola",
      price: 15000,
      image: require("@/assets/icons/com-tam.png"),
      name: "Coca Cola",
      averageRating: 4.0,
      ProductType: {
        name: "Thức uống",
        productTypeId: 2,
      },
    },
    {
      productId: "4",
      description: "Bánh mì pate",
      price: 25000,
      image: require("@/assets/icons/com-tam.png"),
      name: "Bánh mì pate",
      averageRating: 4.3,
      ProductType: {
        name: "Đồ ăn",
        productTypeId: 1,
      },
    },
    {
      productId: "5",
      description: "Nước cam tươi",
      price: 20000,
      image: require("@/assets/icons/com-tam.png"),
      name: "Nước cam tươi",
      averageRating: 4.1,
      ProductType: {
        name: "Thức uống",
        productTypeId: 2,
      },
    },
  ]);

  const { cart, setCart, restaurant } = useCurrentApp();
  const [productTypeList, setProductTypeList] = useState<number[]>([
    1, 2, 3, 4,
  ]);
  const fetchProducts = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        setProducts([
          {
            productId: "1",
            description: "Cơm tấm sườn nướng",
            price: 45000,
            image: require("@/assets/icons/com-tam.png"),
            name: "Cơm tấm sườn nướng",
            averageRating: 4.5,
            ProductType: {
              name: "Đồ ăn",
              productTypeId: 1,
            },
          },
          {
            productId: "2",
            description: "Canh chua cá bông lau",
            price: 35000,
            image: require("@/assets/icons/com-tam.png"),
            name: "Canh chua cá bông lau",
            averageRating: 4.2,
            ProductType: {
              name: "Món canh",
              productTypeId: 4,
            },
          },
          {
            productId: "3",
            description: "Coca Cola",
            price: 15000,
            image: require("@/assets/icons/com-tam.png"),
            name: "Coca Cola",
            averageRating: 4.0,
            ProductType: {
              name: "Thức uống",
              productTypeId: 2,
            },
          },
          {
            productId: "4",
            description: "Bánh mì pate",
            price: 25000,
            image: require("@/assets/icons/com-tam.png"),
            name: "Bánh mì pate",
            averageRating: 4.3,
            ProductType: {
              name: "Đồ ăn",
              productTypeId: 1,
            },
          },
          {
            productId: "5",
            description: "Nước cam tươi",
            price: 20000,
            image: require("@/assets/icons/com-tam.png"),
            name: "Nước cam tươi",
            averageRating: 4.1,
            ProductType: {
              name: "Thức uống",
              productTypeId: 2,
            },
          },
        ]);
        setProductTypeList([1, 2, 3, 4]);
        return;
      }
      const filteredProducts = [
        {
          productId: "1",
          description: "Cơm tấm sườn nướng",
          price: 45000,
          image: require("@/assets/icons/com-tam.png"),
          name: "Cơm tấm sườn nướng",
          averageRating: 4.5,
          ProductType: {
            name: "Đồ ăn",
            productTypeId: 1,
          },
        },
        {
          productId: "2",
          description: "Canh chua cá bông lau",
          price: 35000,
          image: require("@/assets/icons/com-tam.png"),
          name: "Canh chua cá bông lau",
          averageRating: 4.2,
          ProductType: {
            name: "Món canh",
            productTypeId: 4,
          },
        },
        {
          productId: "3",
          description: "Coca Cola",
          price: 15000,
          image: require("@/assets/icons/com-tam.png"),
          name: "Coca Cola",
          averageRating: 4.0,
          ProductType: {
            name: "Thức uống",
            productTypeId: 2,
          },
        },
        {
          productId: "4",
          description: "Bánh mì pate",
          price: 25000,
          image: require("@/assets/icons/com-tam.png"),
          name: "Bánh mì pate",
          averageRating: 4.3,
          ProductType: {
            name: "Đồ ăn",
            productTypeId: 1,
          },
        },
        {
          productId: "5",
          description: "Nước cam tươi",
          price: 20000,
          image: require("@/assets/icons/com-tam.png"),
          name: "Nước cam tươi",
          averageRating: 4.1,
          ProductType: {
            name: "Thức uống",
            productTypeId: 2,
          },
        },
      ].filter(
        (product) =>
          product.description.toLowerCase().includes(text.toLowerCase()) ||
          product.name.toLowerCase().includes(text.toLowerCase())
      );

      setProducts(filteredProducts);
      setProductTypeList([1, 2, 3, 4]);
    }, 500),
    []
  );
  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    fetchProducts(text);
  };
  const handleQuantityChange = (item: any, action: "MINUS" | "PLUS") => {
    if (!restaurant?._id) return;

    const total = action === "MINUS" ? -1 : 1;
    const priceChange = total * item.productPrice;

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
          basePrice: item.productPrice,
          title: item.productName,
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
          basePrice: item.productPrice,
          title: item.productName,
        },
        quantity: currentQuantity,
      };
    }
    setCart(newCart);
  };
  const getItemQuantity = (itemId: string) =>
    getItemQuantityUtil(cart, restaurant?._id, itemId);
  const handleFilterByProductName = async (typeId: number) => {};
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginHorizontal: 10,
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
          <View
            style={{
              backgroundColor: APP_COLOR.ORANGE,
              width: 25,
              height: 25,
              borderRadius: "100%",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 20,
              top: 5,
              zIndex: 999,
            }}
          >
            <Text style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}>
              1
            </Text>
          </View>
          <View style={styles.notificationWrapper}>
            <SimpleLineIcons name="handbag" size={24} color={APP_COLOR.WHITE} />
          </View>
        </View>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 20,
            color: APP_COLOR.BROWN,
            marginHorizontal: 10,
          }}
        >
          Danh mục
        </Text>
        {productTypeList && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ padding: 10 }}
          >
            {productTypeList.map((item, index) => (
              <Pressable
                key={`${item}-${index}`}
                style={{
                  backgroundColor: APP_COLOR.YELLOW,
                  width: 120,
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 30,
                  alignItems: "center",
                }}
                onPress={() => {
                  handleFilterByProductName(item);
                }}
              >
                {(() => {
                  switch (item) {
                    case 1:
                      return (
                        <Text
                          style={{
                            color: APP_COLOR.BROWN,
                            fontFamily: FONTS.medium,
                            fontSize: 15,
                          }}
                        >
                          Đồ ăn
                        </Text>
                      );
                    case 2:
                      return (
                        <Text
                          style={{
                            color: APP_COLOR.BROWN,
                            fontFamily: FONTS.medium,
                            fontSize: 15,
                          }}
                        >
                          Thức uống
                        </Text>
                      );
                    case 3:
                      return (
                        <Text
                          style={{
                            color: APP_COLOR.BROWN,
                            fontFamily: FONTS.medium,
                            fontSize: 15,
                          }}
                        >
                          Món ăn kèm
                        </Text>
                      );
                    default:
                      return (
                        <Text
                          style={{
                            color: APP_COLOR.BROWN,
                            fontFamily: FONTS.medium,
                            fontSize: 15,
                          }}
                        >
                          Món canh
                        </Text>
                      );
                  }
                })()}
              </Pressable>
            ))}
          </ScrollView>
        )}
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
        Kết quả tìm kiếm (5)
      </Text>
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
                <Image style={styles.itemImage} source={item.image} />
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
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchPage;
