
import { useUsers } from '../hooks/useUsers'

function AdminUsersPage() {
  const {
    usuarios,
    isLoading,
    isError,
    desactivarUsuario,
    isDesactivando,
  } = useUsers()

  async function handleDesactivar(id: number) {
    const confirmar = window.confirm(
      '¿Estás seguro de que querés desactivar este usuario?',
    )

    if (!confirmar) return

    try {
      await desactivarUsuario(id)
    } catch {
      // La notificación de error se puede agregar después.
    }
  }

  if (isLoading) {
    return (
      <p className="py-10 text-center text-slate-600">
        Cargando usuarios...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-600">
        No se pudieron cargar los usuarios.
      </p>
    )
  }

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Administración de usuarios
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consultá las cuentas registradas y administrá su estado.
        </p>
      </div>

      {usuarios.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Nombre completo</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {usuario.username}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {usuario.full_name}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {usuario.email}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {usuario.role}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        !usuario.disabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {!usuario.disabled ? 'Activo' : 'Desactivado'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {!usuario.disabled && (
                      <button
                        type="button"
                        disabled={isDesactivando}
                        onClick={() => handleDesactivar(usuario.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminUsersPage
