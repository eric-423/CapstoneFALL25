import { useCurrentApp } from "@/context/app.context";
import { router } from "expo-router";
import ItemSingle from "@/components/order/item.single";

interface IProps {
  menuItem: IMenuItem;
  restaurant: IRestaurant | null;
  isModal: boolean;
  onQuantityChange?: (amount: number) => void;
}

const ItemQuantity = (props: IProps) => {
  const { menuItem, restaurant, isModal, onQuantityChange } = props;
  const { cart, setCart } = useCurrentApp();

  const handlePressItem = (item: IMenuItem, action: "MINUS" | "PLUS") => {
    if (item.options.length && isModal === false) {
      // router.navigate({
      //   pathname:
      //     action === "PLUS" ? "/product/create.modal" : "/product/update.modal",
      //   params: { menuItemId: menuItem._id },
      // });
    } else {
      if (restaurant?._id) {
        const total = action === "MINUS" ? -1 : 1;
        const priceChange = total * item.basePrice;

        if (!cart[restaurant?._id]) {
          cart[restaurant._id] = {
            sum: 0,
            quantity: 0,
            items: {},
          };
        }
        cart[restaurant._id].sum = cart[restaurant._id].sum + priceChange;
        cart[restaurant._id].quantity = cart[restaurant._id].quantity + total;

        if (!cart[restaurant._id].items[item._id]) {
          cart[restaurant._id].items[item._id] = {
            data: menuItem as any,
            quantity: 0,
          };
        }

        const currentQuantity =
          cart[restaurant._id].items[item._id].quantity + total;
        cart[restaurant._id].items[item._id] = {
          data: menuItem as any,
          quantity: currentQuantity,
        };

        if (currentQuantity <= 0) {
          delete cart[restaurant._id].items[item._id];
        }
        setCart((prevState: any) => ({ ...prevState, ...cart }));

        if (onQuantityChange) {
          onQuantityChange(priceChange);
        }
      }
    }
  };

  let showMinus = false;
  let quantity = 0;
  if (restaurant?._id) {
    const store = cart[restaurant?._id!];
    if (store?.items && store?.items[menuItem?._id]) {
      showMinus = true;
      quantity = store?.items[menuItem?._id].quantity;
    }
  }

  return (
    <ItemSingle
      menuItem={menuItem}
      handlePressItem={handlePressItem}
      showMinus={showMinus}
      quantity={quantity}
    />
  );
};

export default ItemQuantity;
