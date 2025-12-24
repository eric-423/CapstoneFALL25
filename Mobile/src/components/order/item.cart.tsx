import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { currencyFormatter } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ItemCartProps {
  image?: any;
  title?: string;
  quantity?: number;
  price?: number;
  description?: string;
  productId?: string;
  handleQuantityChange?: (productId: string, action: "MINUS" | "PLUS") => void;
  getItemQuantity?: (productId: string) => number;
  unitPrice?: number;
  quantityInBranch?: number;
}

const ItemCart = (props: ItemCartProps) => {
  const {
    image,
    title,
    quantity = 0,
    price = 0,
    description,
    productId,
    handleQuantityChange,
    getItemQuantity,
    unitPrice,
  } = props;

  const currentQuantity = getItemQuantity
    ? getItemQuantity(productId || "")
    : quantity;

  const atLimit =
    typeof props.quantityInBranch === "number" &&
    currentQuantity >= props.quantityInBranch;

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.bottomRow}>
          {handleQuantityChange && getItemQuantity && productId ? (
            <View style={styles.quantityContainer}>
              <Pressable
                onPress={() => handleQuantityChange(productId, "MINUS")}
                style={({ pressed }) => ({
                  opacity: currentQuantity > 0 ? (pressed ? 0.5 : 1) : 0.3,
                })}
                disabled={currentQuantity === 0}
              >
                <AntDesign
                  name="minus-circle"
                  size={20}
                  color={
                    currentQuantity > 0
                      ? APP_COLOR.BUTTON_YELLOW
                      : APP_COLOR.BROWN
                  }
                />
              </Pressable>
              <Text style={styles.quantityText}>{currentQuantity}</Text>
              <Pressable
                onPress={() => handleQuantityChange(productId, "PLUS")}
                style={({ pressed }) => ({
                  opacity: atLimit ? 0.3 : pressed ? 0.5 : 1,
                })}
                disabled={atLimit}
              >
                <AntDesign
                  name="plus-circle"
                  size={20}
                  color={atLimit ? APP_COLOR.BROWN : APP_COLOR.BUTTON_YELLOW}
                />
              </Pressable>
            </View>
          ) : (
            <Text style={styles.quantity}>Số lượng: {quantity}</Text>
          )}
          <Text style={styles.price}>{currencyFormatter(price)}</Text>
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  quantityText: {
    minWidth: 25,
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    fontSize: 14,
  },
});
export default ItemCart;
