
import bcrypt
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schema import (
    UserCreate,
    UserPublic,
    UsuarioAdminPublic,
)


class UsuarioService:

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def registrar(self, datos: UserCreate) -> UserPublic:
        username = datos.username.strip().lower()
        email = str(datos.email).strip().lower()

        password_bytes = datos.password.encode("utf-8")

        if len(password_bytes) > 72:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña no puede superar los 72 bytes",
            )

        try:
            with self.uow as uow:
                if uow.usuarios.obtener_por_username(username):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Ya existe un usuario con ese nombre de usuario",
                    )

                if uow.usuarios.obtener_por_email(email):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Ya existe un usuario con ese correo electrónico",
                    )

                usuario = Usuario(
                    username=username,
                    full_name=datos.full_name.strip(),
                    email=email,
                    hashed_password=bcrypt.hashpw(
                        password_bytes,
                        bcrypt.gensalt(),
                    ).decode("utf-8"),
                    role="user",
                    disabled=False,
                )

                uow.usuarios.agregar(usuario)

                resultado = UserPublic.model_validate(usuario)

            return resultado

        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre de usuario o correo electrónico ya existe",
            )

    def autenticar(self, username: str, password: str) -> Usuario:
        with self.uow as uow:
            usuario = uow.usuarios.obtener_por_username(
                username.strip().lower()
            )

            if not usuario or not bcrypt.checkpw(
                password.encode("utf-8"),
                usuario.hashed_password.encode("utf-8"),
            ):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuario o contraseña incorrectos",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            if usuario.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada",
                )

            return usuario

    def obtener_perfil(self, usuario: Usuario) -> UserPublic:
        return UserPublic.model_validate(usuario)

    def listar_usuarios_admin(self) -> list[UsuarioAdminPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.obtener_todos()

            return [
                UsuarioAdminPublic.model_validate(usuario)
                for usuario in usuarios
            ]

    def desactivar(
        self,
        usuario_id: int,
        administrador_id: int,
    ) -> UsuarioAdminPublic:
        if usuario_id == administrador_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No podés desactivar tu propia cuenta",
            )

        with self.uow as uow:
            usuario = uow.usuarios.obtener_por_id(usuario_id)

            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado",
                )

            usuario.disabled = True
            uow.session.add(usuario)
            uow.session.flush()

            return UsuarioAdminPublic.model_validate(usuario)
