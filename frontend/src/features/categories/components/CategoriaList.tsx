
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import type { Categoria } from '../types/categoria'

interface CategoriaListProps {
  categorias: Categoria[]
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
  esAdmin: boolean
}

function CategoriaList({
  categorias,
  onEditar,
  onEliminar,
  esAdmin,
}: CategoriaListProps) {
  const columnas: ColumnDef<Categoria>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => row.original.descripcion || 'Sin descripción',
    },
    {
      accessorKey: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.original.activo
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.activo ? 'Activa' : 'Desactivada'}
        </span>
      ),
    },
  ]

  if (esAdmin) {
    columnas.push({
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEditar(row.original)}
            className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200"
          >
            Editar
          </button>

          <button
            type="button"
            disabled={!row.original.activo}
            onClick={() => {
              if (
                window.confirm(
                  '¿Seguro que querés desactivar esta categoría?',
                )
              ) {
                onEliminar(row.original.id)
              }
            }}
            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-40"
          >
            Desactivar
          </button>
        </div>
      ),
    })
  }

  const tabla = useReactTable({
    data: categorias,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  if (categorias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="mb-3 text-4xl">📂</div>

        <h3 className="text-lg font-semibold text-slate-800">
          Todavía no hay categorías
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {esAdmin
            ? 'Creá una categoría para comenzar a organizar tus productos.'
            : 'Todavía no hay categorías disponibles para consultar.'}
        </p>
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            {tabla.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 font-bold">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                        className="disabled:cursor-default"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tabla.getRowModel().rows.map((fila) => (
              <tr key={fila.id} className="hover:bg-slate-50">
                {fila.getVisibleCells().map((celda) => (
                  <td key={celda.id} className="px-5 py-4 text-slate-600">
                    {flexRender(
                      celda.column.columnDef.cell,
                      celda.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row">
        <p className="text-sm text-slate-500">
          Página {tabla.getState().pagination.pageIndex + 1} de{' '}
          {tabla.getPageCount()}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => tabla.previousPage()}
            disabled={!tabla.getCanPreviousPage()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() => tabla.nextPage()}
            disabled={!tabla.getCanNextPage()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategoriaList
