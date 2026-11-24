
import { useState } from 'react'

import { useProducts } from '../hooks/useProducts'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useCartStore } from '@/store/cartStore'
import { useNotificationStore } from '@/store/notificationStore'

import ProductoCatalogo from '../components/ProductoCatalogo'
import type { Producto } from '../types/producto'

function CatalogoPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [pagina, setPagina] = useState(0)

  const limite = 12

  const { productos, total, isLoading, isError } = useProducts({
    skip: pagina * limite,
    limit: limite,
    busqueda: busqueda.trim() || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
    disponible: true,
  })

  const {
    categoriasActivas,
    isLoading: cargandoCategorias,
  } = useCategories()

  const agregarProducto = useCartStore((state) => state.agregarProducto)
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const totalPaginas = Math.ceil(total / limite)

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor)
    setPagina(0)
  }

  function cambiarCategoria(valor: string) {
    setCategoriaId(valor)
    setPagina(0)
  }

  function agregarAlCarrito(producto: Producto) {
    agregarProducto({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: Number(producto.precio_base),
      cantidad: 1,
    })

    showNotification(
      `${producto.nombre} agregado al carrito`,
      'success',
    )
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          FoodStore
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Nuestro catálogo
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Descubrí nuestros productos y encontrá lo que estás buscando.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => cambiarBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <select
          value={categoriaId}
          onChange={(e) => cambiarCategoria(e.target.value)}
          disabled={cargandoCategorias}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Todas las categorías</option>

          {categoriasActivas.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          No se pudieron cargar los productos. Intentá nuevamente.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {total} productos encontrados
            </p>
          </div>

          <ProductoCatalogo
            productos={productos.filter(
              (producto) => producto.activo && producto.disponible,
            )}
            onAgregar={agregarAlCarrito}
          />

          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPagina((actual) => actual - 1)}
                disabled={pagina === 0}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700 dark:text-white"
              >
                Anterior
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-300">
                Página {pagina + 1} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={() => setPagina((actual) => actual + 1)}
                disabled={pagina >= totalPaginas - 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700 dark:text-white"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default CatalogoPage
