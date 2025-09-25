import { CartAction } from '@/utils/enum';

import type { CartActionPayload, CartItem, CartState } from './cart.type';

// Initial state
export const initialCartState: CartState = {
  items: [],
  isLoading: true,
  isInitialized: false,
};

// Reducer function with proper typing
export function reducer(state: CartState, action: CartActionPayload): CartState {
  switch (action.type) {
    case CartAction.INITIALIZE:
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
        isLoading: false,
      };

    case CartAction.ADD_ITEM: {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex(
        (existingItem: CartItem) => existingItem.productId === item.productId,
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += item.quantity;
        item?.note && item.note.length > 0 && (updatedItems[existingItemIndex].note = item.note);
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...item }],
      };
    }

    case CartAction.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item: CartItem) => item.productId !== action.payload.productId),
      };

    case CartAction.UPDATE_QUANTITY: {
      const item = action.payload;

      if (item.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item: CartItem) => item.productId !== action.payload.productId),
        };
      }

      return {
        ...state,
        items: state.items.map((product: CartItem) =>
          product.productId === item.productId ? { ...product, quantity: item.quantity } : product,
        ),
      };
    }

    case CartAction.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item: CartItem) =>
          item.productId === action.payload.productId ? action.payload : item,
        ),
      };

    case CartAction.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CartAction.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Action creators that return the correct CartActionPayload types
export function initialize(payload: Partial<CartState>): CartActionPayload {
  return {
    type: CartAction.INITIALIZE,
    payload,
  };
}

export function addItem(payload: CartItem): CartActionPayload {
  return {
    type: CartAction.ADD_ITEM,
    payload,
  };
}

export function removeItem(payload: CartItem): CartActionPayload {
  return {
    type: CartAction.REMOVE_ITEM,
    payload,
  };
}

export function updateQuantity(payload: CartItem): CartActionPayload {
  return {
    type: CartAction.UPDATE_QUANTITY,
    payload,
  };
}

export function updateItem(item: CartItem): CartActionPayload {
  return {
    type: CartAction.UPDATE_ITEM,
    payload: item,
  };
}

export function clearCart(): CartActionPayload {
  return {
    type: CartAction.CLEAR_CART,
    payload: null,
  };
}

export function setLoading(isLoading: boolean): CartActionPayload {
  return {
    type: CartAction.SET_LOADING,
    payload: isLoading,
  };
}
