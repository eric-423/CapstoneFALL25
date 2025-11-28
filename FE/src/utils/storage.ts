import { CartState, CartItem } from '@/utils/contexts/cart/cart.type';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function normalizeCartItem(item: CartItem): CartItem {
  if (item.isCombo && item.comboId) {
    return {
      ...item,
      productId: 0,
    };
  }
  return item;
}

export function saveCartToLocalStorage(state: CartState): void {
  try {
    const normalizedItems = state.items.map(normalizeCartItem);
    localStorage.setItem('tamtac_cart', JSON.stringify(normalizedItems));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function loadCartFromLocalStorage(): CartItem[] | null {
  try {
    const saved = localStorage.getItem('tamtac_cart');
    if (saved) {
      const items = JSON.parse(saved) as CartItem[];
      return items.map(normalizeCartItem);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return null;
}
