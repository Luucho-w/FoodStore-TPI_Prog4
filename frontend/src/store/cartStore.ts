
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: ItemCarrito[]

  agregarProducto: (producto: ItemCarrito) => void
  quitarProducto: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciarCarrito: () => void
  obtenerTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregarProducto: (producto) =>
        set((state) => {
          const existente = state.items.find(
            (item) => item.producto_id === producto.producto_id,
          )

          if (existente) {
            return {
              items: state.items.map((item) =>
                item.producto_id === producto.producto_id
                  ? { ...item, cantidad: item.cantidad + producto.cantidad }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, producto],
          }
        }),

      quitarProducto: (productoId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.producto_id !== productoId,
          ),
        })),

      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter(
                  (item) => item.producto_id !== productoId,
                )
              : state.items.map((item) =>
                  item.producto_id === productoId
                    ? { ...item, cantidad }
                    : item,
                ),
        })),

      vaciarCarrito: () => set({ items: [] }),

      obtenerTotal: () =>
        get().items.reduce(
          (total, item) => total + item.precio_unitario * item.cantidad,
          0,
        ),
    }),
    {
      name: 'cart-storage',
    },
  ),
)
