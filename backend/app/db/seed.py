
from app.core.database import crear_tablas
from app.seed import crear_datos_iniciales

# Registrar los modelos antes de crear las tablas
from app.modules.usuarios import model as usuarios_model
from app.modules.categoria import model as categoria_model
from app.modules.producto import model as producto_model
from app.modules.pedidos import model as pedidos_model


def main() -> None:
    crear_tablas()
    crear_datos_iniciales()
    print("Datos iniciales cargados correctamente.")


if __name__ == "__main__":
    main()
