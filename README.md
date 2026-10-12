# Práctica 1: Desarrollo Back End — Postman, Colecciones y Consumo de APIs

Este repositorio contiene la solución completa, verificada y documentada para la **Parte 1 de la práctica de laboratorio de Desarrollo Back End**. El proyecto implementa una API REST local mediante `json-server`, scripts de prueba automatizados y una colección exportable oficial para **Postman (v2.1)** que cubre tanto la API local como el consumo de una API pública externa.

---

## 1. Objetivo de la Práctica

- Configurar y levantar una API REST local simulada utilizando Node.js y `json-server` con persistencia en `db.json`.
- Diseñar y organizar una colección profesional en **Postman** (versión 2.1) estructurada en dos carpetas temáticas: `API Local (db.json)` y `API Publica`.
- Implementar las operaciones CRUD estándar (`GET`, `POST`, `PUT`, `DELETE`) y consultas avanzadas con ordenamiento numérico (`_sort`).
- Consumir recursos remotos en la API pública JSONPlaceholder aplicando filtrado por parámetros de consulta (`query parameters`).
- Incorporar aserciones y pruebas automatizadas (`pm.test`, `pm.expect`) para cada petición HTTP.
- Comprender y documentar las diferencias arquitectónicas y operativas entre el consumo de APIs locales y públicas.

---

## 2. Tecnologías Utilizadas

- **Entorno de ejecución:** Node.js (v22.x / v18+) y npm.
- **Servidor REST simulado:** `json-server` (^0.17.4).
- **Cliente de pruebas de API:** Postman (v10+ / v11+).
- **Ejecutor de pruebas automatizadas CLI:** Newman (^6.2.1).
- **Persistencia local:** Archivo estructurado `db.json`.

---

## 3. Estructura del Proyecto

```text
practica-backend/
├── .gitignore                                     # Exclusiones de control de versiones
├── package.json                                   # Definición del proyecto, scripts y dependencias
├── package-lock.json                              # Árbol de dependencias bloqueado
├── db.json                                        # Base de datos JSON inicial de la API local
├── README.md                                      # Documentación técnica general
├── docs/
│   └── nota-api-local-vs-publica.md               # Análisis comparativo entre API local y pública
├── postman/
│   └── Practica Backend - APIs.postman_collection.json # Colección oficial Postman v2.1
├── scripts/
│   ├── reset-db.js                                # Script para restaurar db.json al estado inicial
│   └── validate-all.js                            # Script de validación automatizada de endpoints
└── evidencia/
    └── README.md                                  # Guía y lista de comprobación para capturas de pantalla
```

---

## 4. Requisitos Previos

1. **Node.js**: Versión 18.x o superior instalada (comprobar con `node -v`).
2. **npm**: Gestor de paquetes de Node.js (comprobar con `npm -v`).
3. **Postman**: Aplicación de escritorio instalada o cuenta en Postman para Web/Desktop.
4. **Conexión a Internet**: Requerida para la instalación inicial de dependencias y para las peticiones a la API pública.

---

## 5. Instalación de Dependencias

Clona o descarga el repositorio en tu máquina y, dentro de la raíz del proyecto, ejecuta:

```bash
npm install
```

Esto instalará localmente `json-server` y `newman` en la carpeta `node_modules`.

---

## 6. Inicio de la API Local

Para iniciar el servidor local en el puerto **3000** escuchando cambios en `db.json`:

```bash
npm run api
```

El servidor quedará activo en la consola mostrando:
```text
  Resources
  http://localhost:3000/productos
  http://localhost:3000/usuarios
```

> **Nota:** Mantén esa ventana de terminal abierta mientras ejecutes las peticiones en Postman o ejecutes las pruebas.

---

## 7. Direcciones de los Recursos Locales

- **Productos:** `http://localhost:3000/productos`
- **Producto específico:** `http://localhost:3000/productos/:id`
- **Usuarios:** `http://localhost:3000/usuarios`
- **Usuario específico:** `http://localhost:3000/usuarios/:id`
- **Ordenamiento:** `http://localhost:3000/productos?_sort=precio`

---

## 8. Cómo Importar la Colección en Postman

1. Abre la aplicación **Postman**.
2. En la barra superior izquierda, haz clic en el botón **Import** (o presiona `Ctrl + O`).
3. Selecciona la pestaña **Files** o arrastra el archivo:
   `postman/Practica Backend - APIs.postman_collection.json`
4. Confirma la importación. Verás aparecer en el panel izquierdo la colección:
   `Practica Backend - APIs`
5. La colección contiene dos carpetas:
   - `API Local (db.json)` (6 peticiones)
   - `API Publica` (3 peticiones)

---

## 9. Descripción de las Peticiones y Cuerpos JSON

### Carpeta 1: `API Local (db.json)`

#### 1. `GET - Listar todos los productos`
- **Método:** `GET`
- **URL:** `http://localhost:3000/productos`
- **Descripción:** Obtiene todos los productos registrados.
- **Resultado esperado:** Código `200 OK` y array con los productos.

#### 2. `GET - Consultar producto por ID`
- **Método:** `GET`
- **URL:** `http://localhost:3000/productos/2`
- **Descripción:** Obtiene el producto con identificador 2.
- **Resultado esperado:** Código `200 OK`, objeto con `nombre: "Mouse inalámbrico"`, `precio: 14000`, `stock: 30`.

#### 3. `POST - Crear producto`
- **Método:** `POST`
- **URL:** `http://localhost:3000/productos`
- **Encabezados:** `Content-Type: application/json`
- **Cuerpo (Body - raw JSON):**
  ```json
  {
    "nombre": "Auriculares",
    "precio": 32000,
    "stock": 20
  }
  ```
- **Resultado esperado:** Código `201 Created`, objeto con los datos enviados y un `id` generado automáticamente (`id: 4`).

#### 4. `PUT - Actualizar producto`
- **Método:** `PUT`
- **URL:** `http://localhost:3000/productos/1`
- **Encabezados:** `Content-Type: application/json`
- **Cuerpo (Body - raw JSON):**
  ```json
  {
    "id": 1,
    "nombre": "Teclado mecánico actualizado",
    "precio": 27000,
    "stock": 10
  }
  ```
- **Resultado esperado:** Código `200 OK`, objeto con los campos actualizados.

#### 5. `DELETE - Eliminar producto`
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/productos/3`
- **Descripción:** Remueve el registro con ID 3 (Monitor 24 pulgadas).
- **Resultado esperado:** Código `200 OK` (o `204 No Content`). La prueba automatizada asociada ejecuta internamente una verificación secundaria hacia `http://localhost:3000/productos/3` asegurando que retorne `404 Not Found`.

#### 6. `GET - Ordenar productos por precio`
- **Método:** `GET`
- **URL:** `http://localhost:3000/productos?_sort=precio`
- **Descripción:** Retorna los productos ordenados ascendentemente según su valor numérico de precio.
- **Resultado esperado:** Código `200 OK`, array ordenado (ej. 14000, 27000, 32000).

---

### Carpeta 2: `API Publica`

#### 7. `GET - Listar publicaciones públicas`
- **Método:** `GET`
- **URL:** `https://jsonplaceholder.typicode.com/posts`
- **Descripción:** Consulta 100 publicaciones ficticias.
- **Resultado esperado:** Código `200 OK`, array con objetos que contienen `userId`, `id`, `title` y `body`.

#### 8. `GET - Consultar publicación por ID`
- **Método:** `GET`
- **URL:** `https://jsonplaceholder.typicode.com/posts/1`
- **Descripción:** Consulta el post específico con identificador 1.
- **Resultado esperado:** Código `200 OK`, objeto con `id: 1` y campos válidos.

#### 9. `GET - Filtrar publicaciones por usuario`
- **Método:** `GET`
- **URL:** `https://jsonplaceholder.typicode.com/posts?userId=1`
- **Descripción:** Filtra mediante query param las publicaciones del autor `userId=1`.
- **Resultado esperado:** Código `200 OK`, array donde el 100% de las publicaciones tienen `userId === 1`.

---

## 10. Pruebas Automatizadas y Secuencia de Ejecución

Cada una de las peticiones incluye scripts en la pestaña **Tests** de Postman con aserciones estrictas (`pm.test`).

### Secuencia de ejecución recomendada:
Para evitar inconsistencias debidas a la mutación de `db.json`, se recomienda el siguiente orden:
1. `GET - Listar todos los productos` (verifica estado inicial).
2. `GET - Consultar producto por ID` (consulta ID 2).
3. `POST - Crear producto` (crea el ID 4 sin alterar el 1, 2 o 3).
4. `PUT - Actualizar producto` (actualiza el ID 1).
5. `DELETE - Eliminar producto` (elimina el ID 3 y comprueba su ausencia 404).
6. `GET - Ordenar productos por precio` (ordena los productos restantes 1, 2 y 4).
7. `GET - Listar publicaciones públicas`.
8. `GET - Consultar publicación por ID`.
9. `GET - Filtrar publicaciones por usuario`.

---

## 11. Cómo Restablecer la Base de Datos

Cada vez que ejecutes pruebas que creen, modifiquen o eliminen registros en `db.json`, puedes devolver la base de datos a su estado original ejecutando:

```bash
npm run reset-db
```

El archivo `db.json` volverá a contener exactamente los 3 productos y 2 usuarios iniciales:
- ID 1: Teclado mecánico ($25000, stock 12)
- ID 2: Mouse inalámbrico ($14000, stock 30)
- ID 3: Monitor 24 pulgadas ($98000, stock 5)
- Usuarios: Ana (admin) y Luis (cliente)

---

## 12. Ejecución Automatizada de Pruebas (Newman y Script)

El proyecto incluye dos formas de validación programática:

1. **Validación directa de endpoints por script:**
   ```bash
   node scripts/validate-all.js
   ```
2. **Ejecución formal de la colección con Newman (motor oficial de Postman):**
   ```bash
   npm run test:collection
   ```

Ambos comandos confirmarán el paso exitoso de todas las aserciones.

---

## 13. Resolución de Problemas Frecuentes

| Problema | Causa Posible | Solución |
|---|---|---|
| `Error: listen EADDRINUSE: address already in use :::3000` | El puerto 3000 ya está siendo utilizado por otra instancia o proceso. | Detén el proceso anterior o revisa con `Get-NetTCPConnection -LocalPort 3000` en PowerShell y termina el proceso. |
| `Status 404 Not Found` en `DELETE` o `GET` por ID | La base de datos fue modificada en una prueba previa y el ID ya no existe. | Ejecuta `npm run reset-db` y vuelve a lanzar la prueba. |
| `ECONNREFUSED 127.0.0.1:3000` | El servidor `json-server` no está corriendo. | Ejecuta `npm run api` en una terminal antes de probar en Postman. |
| Las pruebas de la API Pública fallan | Pérdida de conexión a internet o bloqueo corporativo/proxy hacia `jsonplaceholder.typicode.com`. | Verifica la conexión a internet en el navegador ingresando a `https://jsonplaceholder.typicode.com/posts/1`. |
