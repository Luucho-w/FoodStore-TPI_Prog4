
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import type { Producto } from '../types/producto'

interface ProductoListProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onEliminar: (id: number) => void
  esAdmin: boolean
}

function ProductoList({
  productos,
  onEditar,
  onEliminar,
  esAdmin,
}: ProductoListProps) {
  const columnas: ColumnDef<Producto>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      accessorKey: 'categoria_id',
      header: 'ID categoría',
    },
    {
      accessorKey: 'precio_base',
      header: 'Precio',
      cell: ({ row }) => `$ ${row.original.precio_base}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
    },
    {
      accessorKey: 'disponible',
      header: 'Disponibilidad',
      cell: ({ row }) =>
        row.original.disponible ? 'Disponible' : 'No disponible',
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
          {row.original.activo ? 'Activo' : 'Desactivado'}
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
            disabled={!row.original.activo}
            className="rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-200 disabled:opacity-40"
          >
            Editar
          </button>

          <button
            type="button"
            disabled={!row.original.activo}
            onClick={() => {
              if (
                window.confirm(
                  '¿Seguro que querés desactivar este producto?',
                )
              ) {
                onEliminar(row.original.id)
              }
            }}
            className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200 disabled:opacity-40"
          >
            Desactivar
          </button>
        </div>
      ),
    })
  }

  const tabla = useReactTable({
    data: productos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  })

  if (productos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Todavía no hay productos registrados.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            {tabla.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
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
                  <td key={celda.id} className="px-4 py-3">
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

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        <span className="text-sm text-slate-500">
          Página {tabla.getState().pagination.pageIndex + 1} de{' '}
          {tabla.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => tabla.previousPage()}
            disabled={!tabla.getCanPreviousPage()}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={() => tabla.nextPage()}
            disabled={!tabla.getCanNextPage()}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoList
