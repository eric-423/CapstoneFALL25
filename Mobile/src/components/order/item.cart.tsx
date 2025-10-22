import { Image, Text, View, StyleSheet } from "react-native";
import { currencyFormatter } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";

interface ItemCartProps {
  image?: any;
  title?: string;
  quantity?: number;
  price?: number;
  description?: string;
}

const ItemCart = (props: ItemCartProps) => {
  return (
    <View style={styles.container}>
      <Image source={props.image} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.quantity}>Số lượng: {props.quantity}</Text>
          <Text style={styles.price}>
            {currencyFormatter(props.price || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    marginBottom: 4,
  },
  description: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantity: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
  },
  price: {
    fontFamily: FONTS.bold,
    color: APP_COLOR.ORANGE,
    fontSize: 17,
  },
});
export default ItemCart;
