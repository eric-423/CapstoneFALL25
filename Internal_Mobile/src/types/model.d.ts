interface IUserLogin {
  userInfo: {
    email: string;
    fullName: string;
    id: string;
    address: any;
    memberPoint: number;
    phone: string;
    role: string;
  };
  token: string;
}
interface ICart {
  [key: string]: {
    sum: number;
    quantity: number;
    items: {
      [key: string]: {
        quantity: number;
        data: IMenuItem;
        extra?: {
          [key: string]: number;
        };
      };
    };
  };
}
interface ICounter {
  longitude: number;
  latitude: number;
  _id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  rating: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  menu: IMenu[];
  isLike: boolean;
}

interface IOrder {
  id: number;
  orderStatus: string;
  orderDate: string;
  paymentTime: string | null;
  deliveryAt: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  branchName: string;
  branchAddress: string;
  subTotal: number;
  shippingFee: number;
  discountValue: number;
  amount: number;
  promotionCode: string;
  pointUsed: number;
  pointEarned: number;
  shipperName: string | null;
  waiterName: string | null;
  chefName: string | null;
  itemCount: number;
  table: boolean;
  pickUp: boolean;
}
