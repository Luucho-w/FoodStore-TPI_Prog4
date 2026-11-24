
import { Navigate, Route, Routes } from 'react-router-dom'

import Navbar from '@/shared/components/Navbar'
import UnauthorizedPage from '@/shared/components/UnauthorizedPage'
import ProtectedRoute from './ProtectedRoute'

import {
  LoginPage,
  RegisterPage,
  AdminUsersPage,
} from '@/features/auth'

import { CategoriasPage } from '@/features/categories'
import { ProductsPage } from '@/features/products'
import CatalogoPage from '@/features/products/pages/CatalogoPage'
import { CartPage } from '@/features/cart'

import {
  CheckoutPage,
  MisPedidosPage,
  PedidoDetallePage,
  AdminPedidosPage,
  AdminResumenPage,
} from '@/features/orders'

function AppRouter() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/carrito" element={<CartPage />} />

          {/* Rutas para usuarios autenticados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
            <Route
              path="/mis-pedidos/:pedidoId"
              element={<PedidoDetallePage />}
            />
          </Route>

          {/* Rutas exclusivas para administradores */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/resumen" element={<AdminResumenPage />} />
            <Route path="/admin/categorias" element={<CategoriasPage />} />
            <Route path="/admin/productos" element={<ProductsPage />} />
            <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
          </Route>

          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default AppRouter
