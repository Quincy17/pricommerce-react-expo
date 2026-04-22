import { create } from 'zustand';
import { CartItem } from './cartStore';

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: Date;
};

type OrderStore = {
  orders: Order[];
  pendingOrder: Omit<Order, 'id' | 'status' | 'createdAt'> | null;
  setPendingOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
  confirmOrder: () => string;
  clearPendingOrder: () => void;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  pendingOrder: null,

  setPendingOrder: (order) => set({ pendingOrder: order }),

  confirmOrder: () => {
    const pending = get().pendingOrder;
    if (!pending) return '';
    const id = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...pending,
      id,
      status: 'paid',
      createdAt: new Date(),
    };
    set((state) => ({
      orders: [newOrder, ...state.orders],
      pendingOrder: null,
    }));
    return id;
  },

  clearPendingOrder: () => set({ pendingOrder: null }),
}));
