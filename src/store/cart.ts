import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../models/Product';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: Record<number, CartItem>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (product, quantity = 1) => {
        const current = get().items[product.id];
        const nextQty = (current?.quantity ?? 0) + quantity;
        set(state => ({
          items: {
            ...state.items,
            [product.id]: { product, quantity: nextQty },
          },
        }));
      },
      removeItem: (productId) => {
        set(state => {
          const copy = { ...state.items };
          delete copy[productId];
          return { items: copy };
        });
      },
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set(state => {
            const copy = { ...state.items };
            delete copy[productId];
            return { items: copy };
          });
          return;
        }
        set(state => {
          const current = state.items[productId];
          if (!current) return state;
          return {
            items: {
              ...state.items,
              [productId]: { ...current, quantity },
            },
          };
        });
      },
      clear: () => set({ items: {} }),
    }),
    { name: 'cart-store' }
  )
); 