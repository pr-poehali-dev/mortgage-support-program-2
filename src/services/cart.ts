export interface CartItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  icon?: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'mgsn_cart';

export const cartService = {
  getCart(): CartItem[] {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch {
      return [];
    }
  },

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const cart = this.getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  removeItem(itemId: string): void {
    const cart = this.getCart().filter(item => item.id !== itemId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const cart = this.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  },

  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event('cartUpdated'));
  },

  getItemCount(): number {
    return this.getCart().reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice(): number {
    return this.getCart().reduce((total, item) => {
      const price = parseInt(item.price.replace(/\D/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  }
};
