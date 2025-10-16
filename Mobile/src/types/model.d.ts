export {};

declare global {
  interface ICart {
    [key: string]: {
      sum: number;
      quantity: number;
      items: {
        [key: string]: {
          quantity: number;
          data: ICartItem;
          extra?: {
            [key: string]: number;
          };
        };
      };
    };
  }
  interface IMenuItem {
    productImage: any;
    productId: number;
    _id: string;
    menu: string;
    title: string;
    name: string;
    description: string;
    basePrice: number;
    price: number;
    image: string;
    options: {
      title: string;
      description: string;
      additionalPrice: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IRestaurant {
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

  interface ICartItem {
    ProductType: {
      name: string;
      productTypeId: number;
    };
    name: string;
    productId: string;
    image: string;
    description: string;
    price: number;
    basePrice?: number;
    title?: string;
  }
}
