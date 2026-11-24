# Food Store – Backend

Trabajo Práctico Integrador de Programación IV – Unidad 9: Estado global con Zustand y autenticación.

## Descripción

Backend de una aplicación de gestión de una tienda de comidas. Permite administrar usuarios, categorías, productos y pedidos.

La API está desarrollada con FastAPI y SQLModel, y utiliza PostgreSQL para almacenar la información.

Incluye autenticación mediante JWT almacenado en una cookie HttpOnly, registro de usuarios, control de acceso por roles, gestión de productos y categorías, creación y seguimiento de pedidos, y control de stock.

## Tecnologías utilizadas

- Python 3.13
- FastAPI
- SQLModel
- PostgreSQL
- Psycopg
- Pydantic Settings
- JWT (python-jose)
- bcrypt

## Estructura del proyecto

```text
backend/
├── app/
│   ├── main.py
│   ├── seed.py
│   ├── core/
│   │   ├── base_repository.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── deps.py
│   │   ├── security.py
│   │   └── unit_of_work.py
│   └── modules/
│       ├── usuarios/
│       ├── categoria/
│       ├── producto/
│       └── pedidos/
├── pruebas.http
├── pedidos.http
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

Cada módulo contiene sus modelos, esquemas, repositorios, servicios y routers correspondientes.

## Requisitos previos

- Python 3.11 o superior.
- PostgreSQL 15 o superior.
- Una base de datos PostgreSQL creada para el proyecto.

## Instalación

Desde la carpeta `backend`, crear un entorno virtual:

```powershell
python -m venv .venv
```

Activarlo en Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instalar las dependencias:

```powershell
pip install -r requirements.txt
```

## Configuración de variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Configurar los datos de conexión a PostgreSQL y la clave secreta utilizada para firmar los JWT.

Ejemplo:

```env
DATABASE_URL=postgresql+psycopg://postgres:TU_CLAVE@localhost:5432/foodstore_tpi_db
SECRET_KEY=TU_CLAVE_SECRETA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
DEBUG=False
COOKIE_SECURE=False
```

Reemplazar los valores de ejemplo por los correspondientes al entorno local.

No compartir ni subir el archivo `.env` al repositorio.

## Ejecución

Desde la carpeta `backend`, iniciar el servidor:

```powershell
python -m uvicorn app.main:app --reload
```

La API estará disponible en:

- http://127.0.0.1:8000
- Documentación Swagger: http://127.0.0.1:8000/docs

Al iniciar la aplicación se crean las tablas necesarias y se ejecuta la carga de datos iniciales.

## Datos iniciales

El sistema incorpora automáticamente:

- Un usuario administrador.
- Tres categorías iniciales.
- Ocho productos de ejemplo.

Credenciales iniciales del administrador:

```text
Usuario: admin
Contraseña: Admin1234!
```

Estas credenciales son únicamente para el entorno de demostración. Se recomienda cambiarlas antes de utilizar el sistema en un entorno real.

## Funcionalidades principales

### Autenticación y usuarios
- Registro e inicio de sesión.
- Autenticación mediante JWT en cookie HttpOnly.
- Cierre de sesión.
- Consulta del perfil.
- Gestión administrativa de usuarios y desactivación de cuentas.

### Categorías
- Consulta de categorías activas.
- Alta, modificación y baja lógica de categorías.
- Operaciones administrativas protegidas por rol.

### Productos
- Consulta del catálogo.
- Búsqueda y filtrado de productos.
- Alta, modificación y baja lógica.
- Actualización de stock.
- Control de disponibilidad.

### Pedidos
- Creación de pedidos por usuarios autenticados.
- Validación de productos y stock disponible.
- Descuento automático del stock.
- Conservación del nombre y precio de los productos al momento de la compra.
- Consulta de pedidos propios.
- Cancelación de pedidos pendientes y restauración del stock.
- Gestión administrativa de estados y consulta de estadísticas.

## Arquitectura

El backend utiliza una arquitectura por capas:

- **Models:** representan las entidades y tablas de la base de datos.
- **Schemas:** validan los datos de entrada y salida.
- **Repositories:** centralizan las consultas y operaciones sobre la base de datos.
- **Services:** implementan la lógica de negocio.
- **Routers:** exponen los endpoints de la API.
- **Unit of Work:** administra las sesiones y transacciones.
- **Base Repository:** proporciona operaciones genéricas reutilizables.

## Seguridad

- Contraseñas almacenadas mediante hash bcrypt.
- Tokens JWT firmados.
- Cookies HttpOnly.
- Protección de endpoints según autenticación y roles.
- Control de usuarios desactivados.
- Configuración mediante variables de entorno.

## Pruebas de API

Se incluyen los archivos `pruebas.http` y `pedidos.http` para realizar solicitudes de prueba a los endpoints desde un editor compatible, como Visual Studio Code con la extensión REST Client.

