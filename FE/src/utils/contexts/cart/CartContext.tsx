/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { loadCartFromLocalStorage, saveCartToLocalStorage } from '@/utils/storage';

import { useContext } from 'react';
import { createContext, type FC, type PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';

import {
  addItem as addItemAction,
  clearCart as clearCartAction,
  initialCartState,
  initialize,
  reducer,
  removeItem as removeItemAction,
  updateItem as updateItemAction,
  updateQuantity as updateQuantityAction,
} from './cart.reducer';
import type { CartContextType, CartItem } from './cart.type';
import { CartState } from './cart.type';

const CartContext = createContext<CartContextType>({
  ...initialCartState,
  dispatch: () => null,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  updateItem: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
});

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = loadCartFromLocalStorage();
        dispatch(
          initialize({
            items: savedCart || [],
            isLoading: false,
            isInitialized: true,
          } as CartState),
        );
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        dispatch(
          initialize({
            items: [],
            isLoading: false,
            isInitialized: true,
          }),
        );
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.isInitialized && !state.isLoading) {
      try {
        saveCartToLocalStorage(state);
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    }
  }, [state.items, state.isInitialized, state.isLoading]);

  // Cart methods
  const addItem = useCallback((item: CartItem) => {
    dispatch(addItemAction(item));
  }, []);

  const removeItem = useCallback((item: CartItem) => {
    dispatch(removeItemAction(item));
  }, []);

  const updateQuantity = useCallback((item: CartItem) => {
    dispatch(updateQuantityAction(item));
  }, []);

  const updateItem = useCallback((item: CartItem) => {
    dispatch(updateItemAction(item));
  }, []);

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, []);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((total, item) => {
      const itemTotal = item.productPrice * item.quantity;
      return total + itemTotal;
    }, 0);
  }, [state.items]);

  // Context value
  const contextValue = useMemo(
    () => ({
      ...state,
      dispatch,
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }),
    [state, addItem, removeItem, updateQuantity, updateItem, clearCart, getTotalItems, getTotalPrice],
  );

  // Show loading spinner until cart is initialized
  if (!state.isInitialized) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
