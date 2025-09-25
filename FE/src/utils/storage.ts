import { CartState } from '@/contexts/cart/cart.type';

// Helper function to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Cart storage helpers
export function saveCartToLocalStorage(state: CartState): void {
  try {
    localStorage.setItem('tamtac_cart', JSON.stringify(state.items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function loadCartFromLocalStorage(): CartState | null {
  try {
    const saved = localStorage.getItem('tamtac_cart');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return null;
}

// // Order storage helpers
// export function saveOrdersToLocalStorage(state: OrderState): void {
//   try {
//     localStorage.setItem("tamtac_orders", JSON.stringify(state))
//   } catch (error) {
//     console.error("Failed to save orders to localStorage:", error)
//   }
// }

// export function loadOrdersFromLocalStorage(): OrderState | null {
//   try {
//     const saved = localStorage.getItem("tamtac_orders")
//     if (saved) {
//       return JSON.parse(saved)
//     }
//   } catch (error) {
//     console.error("Failed to load orders from localStorage:", error)
//   }
//   return null
// }
