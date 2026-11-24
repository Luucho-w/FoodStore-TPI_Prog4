
import { useState } from 'react'

import { useIngredients } from '../hooks/useIngredients'
import type {
  Ingrediente,
  IngredienteCreate,
} from '../types/ingrediente'

import IngredienteList from '../components/IngredienteList'
import IngredienteModal from '../components/IngredienteModal'

function IngredientesPage() {
  const {
    ingredientes,
    isLoading,
    isError,
    refetch,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
    isCreando,
    isActualizando,
    isEliminando,
  } = useIngredients()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [ingredienteSeleccionado, setIngredienteSeleccionado] =
    useState<Ingrediente | null>(null)
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null)

  function cerrarModal() {
    setModalAbierto(false)
    setIngredienteSeleccionado(null)
    setErrorOperacion(null)
  }

  function abrirCrear() {
    setIngredienteSeleccionado(null)
    setErrorOperacion(null)
    setModalAbierto(true)
  }

  function abrirEditar(ingrediente: Ingrediente) {
    setIngredienteSeleccionado(ingrediente)
    setErrorOperacion(null)
    setModalAbierto(true)
  }

  async function guardarIngrediente(datos: IngredienteCreate) {
    setErrorOperacion(null)

    try {
      if (ingredienteSeleccionado) {
        await actualizarIngrediente({
          id: ingredienteSeleccionado.id,
          datos,
        })
      } else {
        await crearIngrediente(datos)
      }

      cerrarModal()
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el ingrediente.',
      )
    }
  }

  async function borrarIngrediente(id: number) {
    setErrorOperacion(null)

    try {
      await eliminarIngrediente(id)
    } catch (error) {
      setErrorOperacion(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el ingrediente.',
      )
    }
  }

  const cargando = isCreando || isActualizando

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Ingredientes
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Consultá y administrá los ingredientes registrados en el sistema.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Nuevo ingrediente
        </button>
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
          Cargando ingredientes...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudieron cargar los ingredientes.
          <button
            onClick={() => refetch()}
            className="ml-2 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <IngredienteList
          ingredientes={ingredientes}
          onEditar={abrirEditar}
          onEliminar={borrarIngrediente}
        />
      )}

      <IngredienteModal
        abierto={modalAbierto}
        ingrediente={ingredienteSeleccionado}
        onCerrar={cerrarModal}
        onGuardar={guardarIngrediente}
      />

      {cargando && (
        <p className="text-sm text-slate-500">
          Guardando ingrediente...
        </p>
      )}

      {isEliminando && (
        <p className="text-sm text-slate-500">
          Eliminando ingrediente...
        </p>
      )}
    </section>
  )
}

export default IngredientesPage
