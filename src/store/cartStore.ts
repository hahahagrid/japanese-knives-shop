import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  imageUrl: string | null
  quantity: number
  status: string
  type: 'knife' | 'accessory'
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (isOpen: boolean) => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true, // Open cart when adding
            }
          }
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true,
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      setCartOpen: (isOpen) => {
        set({ isOpen })
      },

      getTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'products-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist UI state (isOpen)
      partialize: (state) => ({ items: state.items }),
    }
  )
)
