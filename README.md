# FoodStore – Trabajo Práctico Integrador

Aplicación web de gestión y venta de productos gastronómicos, desarrollada como Trabajo Práctico Integrador de Programación IV.

El sistema permite consultar un catálogo de productos, registrarse, iniciar sesión, realizar pedidos y administrar productos, categorías, usuarios y pedidos según el rol del usuario.

## Tecnologías utilizadas

### Backend
- Python
- FastAPI
- SQLModel
- SQLAlchemy
- PostgreSQL
- JWT para autenticación
- Cookies HttpOnly

### Frontend
- React
- TypeScript
- Vite
- React Router
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand
- Axios
- Tailwind CSS

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- Python 3.13 o compatible con las dependencias del proyecto.
- Node.js y pnpm.
- PostgreSQL.
- Git (opcional, para clonar el repositorio).

## Clonar el repositorio

```bash
git clone https://github.com/Luucho-w/FoodStore-TPI_Prog4.git
cd FoodStore-TPI_Prog4
```

## Configuración del backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Crear un entorno virtual:

```bash
python -m venv .venv
```

Activarlo en Windows:

```bash
.venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

### Configuración de variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend`, tomando como referencia `.env.example`.

Configurar las siguientes variables:

```env
DATABASE_URL=postgresql+psycopg://postgres:CONTRASENA@localhost:5432/foodstore_tpi_db
SECRET_KEY=CAMBIAR_POR_UNA_CLAVE_SECRETA_SEGURA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
DEBUG=False
COOKIE_SECURE=False
```

Reemplazar `CONTRASENA` por la contraseña del usuario de PostgreSQL y `SECRET_KEY` por una clave secreta segura.

### Base de datos

Crear en PostgreSQL una base de datos llamada:

```sql
CREATE DATABASE foodstore_tpi_db;
```

### Cargar datos iniciales

Desde la carpeta `backend`, ejecutar:

```bash
python -m app.db.seed
```

Este comando crea las tablas necesarias y carga los datos iniciales, incluyendo el usuario administrador, las categorías y los productos.

### Ejecutar el backend

Desde la carpeta `backend`:

```bash
uvicorn app.main:app --reload
```

La API estará disponible en:

http://localhost:8000

Documentación interactiva:

http://localhost:8000/docs

## Configuración del frontend

Abrir otra terminal e ingresar a la carpeta `frontend`:

```bash
cd frontend
```

Instalar las dependencias:

```bash
pnpm install
```

Crear un archivo `.env` tomando como referencia `.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

### Ejecutar el frontend

```bash
pnpm dev
```

La aplicación estará disponible en:

http://localhost:5173

Para comprobar la compilación de producción:

```bash
pnpm build
```

## Usuario administrador

El sistema incluye un usuario administrador creado mediante el proceso de carga inicial de datos.

| Campo | Credencial |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin1234!` |
| Rol | Administrador |

Estas credenciales corresponden al entorno de desarrollo y demostración.

## Funcionalidades principales

### Usuarios
- Registro e inicio de sesión.
- Autenticación mediante JWT y cookies HttpOnly.
- Acceso según roles de usuario y administrador.

### Catálogo y compras
- Visualización y búsqueda de productos.
- Filtrado por categorías.
- Paginación del catálogo.
- Carrito de compras persistente.
- Confirmación de pedidos.

### Pedidos
- Consulta de pedidos propios.
- Visualización del detalle de cada pedido.
- Cancelación de pedidos pendientes.
- Restauración del stock al cancelar un pedido.

### Administración
- Panel con resumen general.
- Gestión de categorías.
- Gestión de productos.
- Gestión de pedidos y estados.
- Gestión de usuarios.

## Repositorio de GitHub

https://github.com/Luucho-w/FoodStore-TPI_Prog4

## Video de demostración

En el siguiente enlace se puede visualizar el video de demostración del proyecto, donde se presenta el funcionamiento general de la aplicación y sus principales funcionalidades.

[Ver video de demostración de FoodStore](https://drive.google.com/file/d/1_u6KRgdUyDLdVlBsFRg5ZcTjR7_DTTz6/view?usp=sharing)