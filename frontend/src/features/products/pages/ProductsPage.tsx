
import { useState } from 'react'

import { useProducts } from '../hooks/useProducts'
import type { Producto } from '../types/producto'
import type { ProductoCreate } from '../productoService'
import ProductoList from '../components/ProductoList'
import ProductoModal from '../components/ProductoModal'
import { useAuthStore } from '@/features/auth'

function ProductsPage() {
  const user = useAuthStore((state) => state.user)
  const esAdmin = user?.role === 'admin'

  const {
    productos,
    isLoading,
    isError,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    isCreando,
    isActualizando,
  } = useProducts()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null)
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)

  function cerrarModal() {
    setModalAbierto(false)
    setProductoSeleccionado(null)
    setErrorOperacion(null)
  }

  function abrirCrear() {
    if (!esAdmin) return

    setProductoSeleccionado(null)
    setErrorOperacion(null)
    setModalAbierto(true)
  }

  function abrirEditar(producto: Producto) {
    if (!esAdmin || !producto.activo) return

    setProductoSeleccionado(producto)
    setErrorOperacion(null)
    setModalAbierto(true)
  }

  async function guardarProducto(datos: ProductoCreate) {
    if (!esAdmin) return

    setErrorOperacion(null)

    try {
      if (productoSeleccionado) {
        await actualizarProducto({
          id: productoSeleccionado.id,
          datos,
        })
      } else {
        await crearProducto(datos)
      }

      cerrarModal()
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el producto.',
      )
    }
  }

  async function desactivarProducto(id: number) {
    if (!esAdmin) return

    setErrorOperacion(null)

    try {
      await eliminarProducto(id)
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo desactivar el producto.',
      )
    }
  }

  const cargando = isCreando || isActualizando

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            {esAdmin ? 'Administración' : 'Consulta'}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Productos
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            {esAdmin
              ? 'Consultá y administrá los productos registrados en el sistema.'
              : 'Consultá los productos registrados en el sistema.'}
          </p>
        </div>

        {esAdmin && (
          <button
            type="button"
            onClick={abrirCrear}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {errorOperacion && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {errorOperacion}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500">
          Cargando productos...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudieron cargar los productos.
        </div>
      ) : (
        <ProductoList
          productos={productos}
          onEditar={abrirEditar}
          onEliminar={desactivarProducto}
          esAdmin={esAdmin}
        />
      )}

      {esAdmin && (
        <ProductoModal
          abierto={modalAbierto}
          producto={productoSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={guardarProducto}
        />
      )}

      {cargando && (
        <p className="text-sm text-slate-500">
          Guardando producto...
        </p>
      )}
    </section>
  )
}

export default ProductsPage
