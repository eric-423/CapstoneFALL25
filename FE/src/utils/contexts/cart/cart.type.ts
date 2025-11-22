import type { CartAction } from '@/utils/enum';

import type { Dispatch } from 'react';

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  note?: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isInitialized: boolean;
}

// This is the key type that needs to be fixed
export type CartActionPayload =
  | { type: CartAction.INITIALIZE; payload: Partial<CartState> }
  | { type: CartAction.ADD_ITEM; payload: CartItem }
  | { type: CartAction.REMOVE_ITEM; payload: CartItem }
  | { type: CartAction.UPDATE_QUANTITY; payload: CartItem }
  | { type: CartAction.UPDATE_ITEM; payload: CartItem }
  | { type: CartAction.CLEAR_CART; payload: null }
  | { type: CartAction.SET_LOADING; payload: boolean };

export interface CartContextType extends CartState {
  dispatch: Dispatch<CartActionPayload>;
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
