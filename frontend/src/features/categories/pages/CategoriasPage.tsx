
import { useState } from 'react'

import { useCategories } from '../hooks/useCategories'
import type { Categoria, CategoriaCreate } from '../types/categoria'
import CategoriaList from '../components/CategoriaList'
import CategoriaModal from '../components/CategoriaModal'
import { useAuthStore } from '@/features/auth'

function CategoriasPage() {
  const user = useAuthStore((state) => state.user)
  const esAdmin = user?.role === 'admin'

  const {
    categorias,
    isLoading,
    isError,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    isCreando,
    isActualizando,
    isEliminando,
  } = useCategories()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null)
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)

  function cerrarModal() {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
    setErrorOperacion(null)
  }

  function abrirModalNuevo() {
    if (!esAdmin) return

    setErrorOperacion(null)
    setCategoriaSeleccionada(null)
    setModalAbierto(true)
  }

  function abrirModalEditar(categoria: Categoria) {
    if (!esAdmin) return

    setErrorOperacion(null)
    setCategoriaSeleccionada(categoria)
    setModalAbierto(true)
  }

  async function guardarCategoria(datos: CategoriaCreate) {
    if (!esAdmin) return

    setErrorOperacion(null)

    try {
      if (categoriaSeleccionada) {
        await actualizarCategoria({
          id: categoriaSeleccionada.id,
          datos,
        })
      } else {
        await crearCategoria(datos)
      }

      cerrarModal()
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la categoría.',
      )
    }
  }

  async function borrarCategoria(id: number) {
    if (!esAdmin) return

    setErrorOperacion(null)

    try {
      await eliminarCategoria(id)
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la categoría.',
      )
    }
  }

  const guardando = isCreando || isActualizando

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            {esAdmin ? 'Administración' : 'Consulta'}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Categorías
          </h1>

          <p className="mt-2 text-slate-600">
            {esAdmin
              ? 'Organizá y administrá las categorías de tus productos.'
              : 'Consultá las categorías de los productos.'}
          </p>
        </div>

        {esAdmin && (
          <button
            type="button"
            onClick={abrirModalNuevo}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {errorOperacion && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{errorOperacion}</p>

          <button
            type="button"
            onClick={() => setErrorOperacion(null)}
            aria-label="Cerrar mensaje de error"
            className="font-bold"
          >
            ×
          </button>
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-700">
            Cargando categorías...
          </p>
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white p-8 text-center"
        >
          <h2 className="text-lg font-bold text-slate-800">
            No se pudieron cargar las categorías
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Revisá tu conexión e intentá nuevamente.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Todas las categorías
            </h2>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
              {categorias.length}
            </span>
          </div>

          <CategoriaList
            categorias={categorias}
            onEditar={abrirModalEditar}
            onEliminar={borrarCategoria}
            esAdmin={esAdmin}
          />

          {isEliminando && (
            <p className="text-sm text-slate-500">
              Eliminando categoría...
            </p>
          )}
        </>
      )}

      {esAdmin && (
        <CategoriaModal
          abierto={modalAbierto}
          categoria={categoriaSeleccionada}
          guardando={guardando}
          onCerrar={cerrarModal}
          onSubmit={guardarCategoria}
        />
      )}
    </section>
  )
}

export default CategoriasPage
