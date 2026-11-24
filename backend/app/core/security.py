
from datetime import datetime, timedelta, timezone
from typing import Callable

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario
from app.core.config import settings


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token",
    auto_error=False,
)


def crear_access_token(usuario_id: int) -> str:
    ahora = datetime.now(timezone.utc)

    payload = {
        "sub": str(usuario_id),
        "iat": ahora,
        "exp": ahora + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def obtener_usuario_actual(
    request: Request,
    token: str | None = Depends(oauth2_scheme),
) -> Usuario:
    token = token or request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No estás autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        usuario_id = int(payload.get("sub"))

    except (JWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o vencido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    with UnitOfWork() as uow:
        usuario = uow.usuarios.obtener_por_id(usuario_id)

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Devolvemos el objeto después de cerrar la sesión.
        # No se necesita acceder a relaciones cargadas posteriormente.
        return usuario


def obtener_usuario_activo(
    usuario: Usuario = Depends(obtener_usuario_actual),
) -> Usuario:
    if usuario.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return usuario


def require_role(*roles_permitidos: str) -> Callable:
    def verificar_rol(
        usuario: Usuario = Depends(obtener_usuario_activo),
    ) -> Usuario:
        if usuario.role not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para realizar esta operación",
            )

        return usuario

    return verificar_rol
