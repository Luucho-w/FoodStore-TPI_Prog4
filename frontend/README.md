# FoodStore - Frontend

Frontend de la aplicación FoodStore, desarrollado con React y TypeScript. Permite navegar el catálogo de productos, gestionar el carrito de compras, realizar pedidos y administrar el sistema según el rol del usuario.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand
- Axios
- pnpm

## Requisitos previos

Para ejecutar el proyecto se necesita tener instalado:

- Node.js
- pnpm
- Backend de FoodStore funcionando
- PostgreSQL configurado para el backend

## Instalación

1. Abrir una terminal en la carpeta `frontend`.
2. Instalar las dependencias:

```bash
pnpm install
```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en:

`http://localhost:5173`

## Compilación para producción

Para generar la versión de producción:

```bash
pnpm build
```

Para ejecutar una vista previa de la compilación:

```bash
pnpm preview
```

## Funcionalidades

### Usuarios
- Inicio y cierre de sesión.
- Registro de usuarios.
- Control de acceso según el rol.

### Catálogo y compras
- Visualización del catálogo de productos.
- Búsqueda y filtrado por categoría.
- Paginación de productos.
- Carrito de compras.
- Modificación de cantidades y eliminación de productos.
- Confirmación de pedidos.

### Pedidos
- Visualización de pedidos realizados.
- Consulta del detalle de cada pedido.
- Cancelación de pedidos pendientes.

### Administración
- Panel de resumen.
- Gestión de categorías.
- Gestión de productos.
- Gestión de pedidos y actualización de estados.
- Gestión de usuarios y desactivación de cuentas.

## Estructura del proyecto

```text
frontend/
├── public/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── orders/
│   │   └── products/
│   ├── shared/
│   ├── store/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── pnpm-lock.yaml
├── index.html
└── README.md
```

## Consideraciones

- El frontend consume la API REST desarrollada con FastAPI.
- Las peticiones HTTP se realizan mediante Axios.
- La autenticación utiliza cookies y credenciales.
- TanStack Query administra las consultas y mutaciones.
- Zustand administra el estado global del usuario y del carrito.

## Proyecto académico

Trabajo Práctico Integrador de Programación IV.