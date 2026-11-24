
from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import (
    crear_access_token,
    obtener_usuario_activo,
    require_role,
)
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schema import (
    UserCreate,
    UserPublic,
    UsuarioAdminPublic,
)
from app.modules.usuarios.service import UsuarioService
from app.core.config import settings


router = APIRouter(tags=["Autenticación y usuarios"])


def obtener_usuario_service() -> UsuarioService:
    return UsuarioService(UnitOfWork())


# -------------------------
# AUTENTICACIÓN
# -------------------------

@router.post(
    "/auth/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def registrar_usuario(
    datos: UserCreate,
    service: UsuarioService = Depends(obtener_usuario_service),
):
    return service.registrar(datos)


@router.post("/auth/token")
def iniciar_sesion(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UsuarioService = Depends(obtener_usuario_service),
):
    usuario = service.autenticar(
        username=form_data.username,
        password=form_data.password,
    )

    token = crear_access_token(usuario.id)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {"mensaje": "Inicio de sesión exitoso"}


@router.post("/auth/logout")
def cerrar_sesion(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
    )

    return {"mensaje": "Sesión cerrada correctamente"}


@router.get("/auth/me", response_model=UserPublic)
def obtener_perfil(usuario=Depends(obtener_usuario_activo)):
    return UserPublic.model_validate(usuario)


# -------------------------
# ADMINISTRACIÓN DE USUARIOS
# -------------------------

@router.get(
    "/usuarios",
    response_model=list[UsuarioAdminPublic],
)
def listar_usuarios(
    usuario: Usuario = Depends(require_role("admin")),
    service: UsuarioService = Depends(obtener_usuario_service),
):
    return service.listar_usuarios_admin()


@router.patch(
    "/usuarios/{usuario_id}/desactivar",
    response_model=UsuarioAdminPublic,
)
def desactivar_usuario(
    usuario_id: int,
    administrador: Usuario = Depends(require_role("admin")),
    service: UsuarioService = Depends(obtener_usuario_service),
):
    return service.desactivar(
        usuario_id=usuario_id,
        administrador_id=administrador.id,
    )
