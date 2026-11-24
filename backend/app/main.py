
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import crear_tablas
from app.seed import crear_datos_iniciales

# Registrar todos los modelos en SQLModel
from app.modules.usuarios import model as usuarios_model
from app.modules.categoria import model as categoria_model
from app.modules.producto import model as producto_model
from app.modules.pedidos import model as pedidos_model

# Routers
from app.modules.usuarios.router import router as usuarios_router
from app.modules.categoria.router import router as categoria_router
from app.modules.producto.router import router as producto_router
from app.modules.pedidos.router import router as pedidos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    crear_datos_iniciales()
    yield


app = FastAPI(
    title="API FoodStore",
    description="Backend del trabajo práctico de Programación IV",
    version="2.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar todas las rutas bajo /api/v1
app.include_router(usuarios_router, prefix="/api/v1")
app.include_router(categoria_router, prefix="/api/v1")
app.include_router(producto_router, prefix="/api/v1")
app.include_router(pedidos_router, prefix="/api/v1")


@app.get("/")
def inicio():
    return {"mensaje": "API FoodStore funcionando correctamente"}
