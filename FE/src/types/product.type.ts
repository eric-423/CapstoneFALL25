import { SuccessResponse } from './response.type';

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  rating: number;
  productType: string;
  productQuantity: number;
}

export interface ProductType {
  id: number;
  name: string;
}

export type ProductResponse = SuccessResponse<{
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}>;

export type CartProduct = Product & {
  quantity: number;
  note: string;
};
export interface OrderProduct {
  productId: number;
  quantity: number;
  note: string;
}

export interface OrderProductResponse {
  productId: number;
  productName: string;
  quantity: number;
  note: string;
  price: number;
  feedback?: string;
}
