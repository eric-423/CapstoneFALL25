import { CartAction } from '@/utils/enum';

import type { CartActionPayload, CartItem, CartState } from './cart.type';

export const initialCartState: CartState = {
  items: [],
  isLoading: true,
  isInitialized: false,
};

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
        (existingItem: CartItem) => {
          if (item.isCombo && existingItem.isCombo) {
            return existingItem.comboId === item.comboId;
          } else if (!item.isCombo && !existingItem.isCombo) {
            return existingItem.productId === item.productId;
          }
          return false;
        },
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += item.quantity;
        if (item?.note && item.note.length > 0) {
          updatedItems[existingItemIndex].note = item.note;
        }
        if (updatedItems[existingItemIndex].isCombo) {
          updatedItems[existingItemIndex].productId = 0;
        }
        return { ...state, items: updatedItems };
      }

      const normalizedItem = item.isCombo ? { ...item, productId: 0 } : item;

      return {
        ...state,
        items: [...state.items, normalizedItem],
      };
    }

    case CartAction.REMOVE_ITEM: {
      const payload = action.payload;
      return {
        ...state,
        items: state.items.filter((item: CartItem) => {
          if (payload.isCombo && item.isCombo) {
            return item.comboId !== payload.comboId;
          } else if (!payload.isCombo && !item.isCombo) {
            return item.productId !== payload.productId;
          }
          return true;
        }),
      };
    }

    case CartAction.UPDATE_QUANTITY: {
      const item = action.payload;

      if (item.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((cartItem: CartItem) => {
            if (item.isCombo && cartItem.isCombo) {
              return cartItem.comboId !== item.comboId;
            } else if (!item.isCombo && !cartItem.isCombo) {
              return cartItem.productId !== item.productId;
            }
            return true;
          }),
        };
      }

      return {
        ...state,
        items: state.items.map((cartItem: CartItem) => {
          if (item.isCombo && cartItem.isCombo) {
            return cartItem.comboId === item.comboId 
              ? { ...cartItem, quantity: item.quantity, productId: 0 } 
              : cartItem;
          } else if (!item.isCombo && !cartItem.isCombo) {
            return cartItem.productId === item.productId ? { ...cartItem, quantity: item.quantity } : cartItem;
          }
          return cartItem;
        }),
      };
    }

    case CartAction.UPDATE_ITEM: {
      const payload = action.payload;
      const normalizedPayload = payload.isCombo ? { ...payload, productId: 0 } : payload;
      return {
        ...state,
        items: state.items.map((item: CartItem) => {
          if (payload.isCombo && item.isCombo) {
            return item.comboId === payload.comboId ? normalizedPayload : item;
          } else if (!payload.isCombo && !item.isCombo) {
            return item.productId === payload.productId ? normalizedPayload : item;
          }
          return item;
        }),
      };
    }

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
