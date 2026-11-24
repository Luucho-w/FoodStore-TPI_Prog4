
import bcrypt
from sqlmodel import Session, select

from app.core.database import engine
from app.modules.usuarios.model import Usuario
from app.modules.categoria.model import Categoria
from app.modules.producto.model import Producto


def crear_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def crear_datos_iniciales() -> None:
    with Session(engine) as session:

        # Crear administrador inicial
        administrador = session.exec(
            select(Usuario).where(Usuario.username == "admin")
        ).first()

        if not administrador:
            administrador = Usuario(
                username="admin",
                full_name="Administrador FoodStore",
                email="admin@foodstore.com",
                hashed_password=crear_password_hash("Admin1234!"),
                role="admin",
                disabled=False,
            )
            session.add(administrador)

        # Crear categorías iniciales
        categorias_iniciales = [
            {
                "nombre": "Hamburguesas",
                "descripcion": "Hamburguesas y sándwiches",
            },
            {
                "nombre": "Pizzas",
                "descripcion": "Pizzas y variedades",
            },
            {
                "nombre": "Bebidas",
                "descripcion": "Bebidas frías y calientes",
            },
        ]

        categorias = {}

        for datos in categorias_iniciales:
            categoria = session.exec(
                select(Categoria).where(
                    Categoria.nombre == datos["nombre"]
                )
            ).first()

            if not categoria:
                categoria = Categoria(**datos)
                session.add(categoria)
                session.flush()

            categorias[datos["nombre"]] = categoria

        # Crear productos iniciales
        productos_iniciales = [
            {
                "nombre": "Hamburguesa clásica",
                "descripcion": "Hamburguesa con carne, lechuga y tomate",
                "precio_base": 8500,
                "stock": 20,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Hamburguesa completa",
                "descripcion": "Hamburguesa con queso, jamón y huevo",
                "precio_base": 10500,
                "stock": 15,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Hamburguesa doble",
                "descripcion": "Hamburguesa con doble carne y queso",
                "precio_base": 12500,
                "stock": 10,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Pizza muzzarella",
                "descripcion": "Pizza clásica de muzzarella",
                "precio_base": 11000,
                "stock": 12,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Pizza especial",
                "descripcion": "Pizza con jamón, morrones y aceitunas",
                "precio_base": 13500,
                "stock": 10,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Pizza napolitana",
                "descripcion": "Pizza con tomate y ajo",
                "precio_base": 12500,
                "stock": 8,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Gaseosa",
                "descripcion": "Gaseosa de 1,5 litros",
                "precio_base": 3500,
                "stock": 30,
                "categoria": "Bebidas",
            },
            {
                "nombre": "Agua mineral",
                "descripcion": "Agua mineral de 500 ml",
                "precio_base": 1800,
                "stock": 25,
                "categoria": "Bebidas",
            },
        ]

        for datos in productos_iniciales:
            producto_existente = session.exec(
                select(Producto).where(
                    Producto.nombre == datos["nombre"]
                )
            ).first()

            if not producto_existente:
                producto = Producto(
                    nombre=datos["nombre"],
                    descripcion=datos["descripcion"],
                    precio_base=datos["precio_base"],
                    stock=datos["stock"],
                    disponible=True,
                    activo=True,
                    categoria_id=categorias[datos["categoria"]].id,
                )
                session.add(producto)

        session.commit()
