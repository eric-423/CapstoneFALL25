import HeaderHome from "@/components/home/header.home";
import ItemCart from "@/components/order/item.cart";
import AntDesign from "@expo/vector-icons/AntDesign";
import { APP_COLOR } from "@/utils/constant";
import { View, ScrollView, Text } from "react-native";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import ShareButton from "@/components/button/share.button";

const sampleCartItems = [
  {
    id: 1,
    image: require("@/assets/icons/com-tam.png"),
    title: "Cơm tấm sườn bì chả",
    quantity: 2,
    price: 250000,
    description: "Cơm tấm sườn bì chả",
  },
  {
    id: 2,
    image: require("@/assets/icons/com-tam.png"),
    title: "Bún bò Huế",
    quantity: 1,
    price: 180000,
    description: "Bún bò Huế",
  },
  {
    id: 3,
    image: require("@/assets/icons/com-tam.png"),
    title: "Phở bò tái",
    quantity: 1,
    price: 120000,
    description: "Phở bò tái",
  },
  {
    id: 4,
    image: require("@/assets/icons/com-tam.png"),
    title: "Cà phê sữa đá",
    quantity: 3,
    price: 25000,
    description: "Cà phê sữa đá",
  },
];

const CartPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <HeaderHome pageName="cartPage" />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {sampleCartItems.map((item) => (
          <ItemCart
            key={item.id}
            image={item.image}
            title={item.title}
            quantity={item.quantity}
            price={item.price}
            description={item.description}
          />
        ))}
      </ScrollView>
      <View
        style={{
          flex: 0.5,
          justifyContent: "flex-start",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: APP_COLOR.BROWN,
          padding: 10,
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
          <AntDesign name="caret-down" size={22} color={APP_COLOR.BROWN} />
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
            85 Cô Giang, Q1, TP.HCM
          </Text>
          <AntDesign name="edit" size={24} color={APP_COLOR.BROWN} />
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
            {currencyFormatter(100000)}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: "auto",
            marginTop: 10,
          }}
        >
          <ShareButton
            title="Tiến hành đặt hàng"
            onPress={() => {}}
            btnStyle={{
              width: 300,
              justifyContent: "center",
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
