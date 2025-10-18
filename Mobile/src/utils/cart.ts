export const calculateTotalPrice = (
  cart: ICart | Record<string, any>,
  restaurantId?: string | null
): number => {
  if (!restaurantId) return 0;
  const restaurantCart = cart?.[restaurantId];
  if (!restaurantCart || !restaurantCart.items) return 0;
  return Object.values(restaurantCart.items).reduce(
    (sum: number, item: any) => {
      const price = Number(
        item?.data?.price ||
          item?.data?.basePrice ||
          item?.data?.productPrice ||
          0
      );
      const quantity = Number(item?.quantity || 0);
      return sum + price * quantity;
    },
    0
  );
};

export const calculateTotalQuantity = (
  cart: ICart | Record<string, any>,
  restaurantId?: string | null
): number => {
  if (!restaurantId) return 0;
  const restaurantCart = cart?.[restaurantId];
  if (!restaurantCart || !restaurantCart.items) return 0;
  return Object.values(restaurantCart.items).reduce(
    (total: number, item: any) => total + Number(item?.quantity || 0),
    0
  );
};

export const getItemQuantity = (
  cart: ICart | Record<string, any>,
  restaurantId: string | undefined | null,
  itemId: string
): number => {
  if (!restaurantId) return 0;
  return cart?.[restaurantId]?.items?.[itemId]?.quantity || 0;
};

export const currencyFormatter = (value: any) => {
  const options = {
    significantDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
    symbol: "đ",
  };

  if (typeof value !== "number") value = 0.0;
  value = value.toFixed(options.significantDigits);

  const [currency, decimal] = value.split(".");
  return `${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator
  )} ${options.symbol}`;
};

export const formatDateOnlyToDDMMYYYY = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
