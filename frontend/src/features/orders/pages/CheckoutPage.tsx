
import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useCartStore } from '@/store/cartStore'
import { useNotificationStore } from '@/store/notificationStore'
import {
  crearPedido,
  type PedidoCreate,
  type FormaPago,
} from '../services/pedidoService'

function CheckoutPage() {
  const navigate = useNavigate()

  const items = useCartStore((state) => state.items)
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito)
  const obtenerTotal = useCartStore((state) => state.obtenerTotal)

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const [direccion, setDireccion] = useState('')
  const [formaPago, setFormaPago] = useState<FormaPago>('EFECTIVO')
  const [notas, setNotas] = useState('')

  const mutation = useMutation({
    mutationFn: (datos: PedidoCreate) => crearPedido(datos),

    onSuccess: () => {
        vaciarCarrito()
        showNotification('¡Pedido realizado correctamente!', 'success')
        navigate('/mis-pedidos')
    },

    onError: () => {
      showNotification('No se pudo realizar el pedido. Intentá nuevamente.', 'error')
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (items.length === 0) {
      showNotification('El carrito está vacío', 'error')
      return
    }

    const datos: PedidoCreate = {
      direccion_entrega: direccion.trim(),
      forma_pago: formaPago,
      notas: notas.trim() || null,
      detalles: items.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
      })),
    }

    mutation.mutate(datos)
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          Tu carrito está vacío
        </h1>

        <p className="mt-2 text-slate-600">
          Agregá productos antes de confirmar tu pedido.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Finalizar compra
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-800">
            Datos de entrega
          </h2>

          <div>
            <label
              htmlFor="direccion"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Dirección de entrega
            </label>

            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(event) => setDireccion(event.target.value)}
              minLength={5}
              maxLength={200}
              required
              placeholder="Ingresá tu dirección"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="formaPago"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Forma de pago
            </label>

            <select
              id="formaPago"
              value={formaPago}
              onChange={(event) =>
                setFormaPago(event.target.value as FormaPago)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="notas"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Notas adicionales (opcional)
            </label>

            <textarea
              id="notas"
              value={notas}
              onChange={(event) => setNotas(event.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Indicaciones para la entrega..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? 'Procesando pedido...' : 'Confirmar pedido'}
          </button>
        </form>

        <section className="h-fit rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Resumen del pedido
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.producto_id}
                className="flex justify-between gap-4 border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {item.nombre}
                  </p>

                  <p className="text-sm text-slate-500">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                <p className="font-semibold text-slate-700">
                  ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-slate-200 pt-4">
            <span className="text-lg font-semibold text-slate-800">
              Total
            </span>

            <span className="text-xl font-bold text-blue-600">
              ${obtenerTotal().toLocaleString('es-AR')}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CheckoutPage
