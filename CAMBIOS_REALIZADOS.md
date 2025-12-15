# Cambios Realizados - Examen Final Taller de Programación 2

## Resumen de Modificaciones

Se han actualizado los archivos principales para cumplir con los requisitos de la consigna. Todos los cambios incluyen comentarios explicativos.

---

## 1. ✅ **MODELO DE PRODUCTO** (`src/model/producto.model.js`)

### Cambios:
- ✅ Renombrado de `BookModel` a `ProductoModel`
- ✅ Actualizado nombre de tabla a `'producto'`
- ✅ Agregados campos según consigna:
  - **id**: INTEGER, PRIMARY KEY, autoincrement
  - **producto**: STRING(200), REQUERIDO, no vacío
  - **stockAmount**: INTEGER, REQUERIDO, >= 0
  - **fechaIngreso**: DATEONLY (ISO 8601), opcional, por defecto fecha actual

### Validaciones incluidas:
- Campo `producto` no puede estar vacío
- Campo `stockAmount` debe ser número entero >= 0
- Mensajes de error descriptivos en español

---

## 2. ✅ **VALIDADORES** (`src/validators/validators.model.js`)

### Nuevos validadores creados:
- **`validateProducto()`**: Valida nombre del producto
- **`validateStockAmount()`**: Valida que stock sea entero >= 0
- **`validateIncrementoStock()`**: Valida que incremento sea >= 1
- **`validateFechaIngreso()`**: Valida formato YYYY-MM-DD

Todos retornan: `{ valid: boolean, error?: string }`

---

## 3. ✅ **MIDDLEWARES DE AUTENTICACIÓN**

### A) `src/middlewares/verifyToken.js`
- Valida JWT (Bearer Token) o x-api-key
- Soporta ambas formas de autenticación
- Retorna 401 si no hay credenciales válidas

### B) `src/middlewares/validateApiKey.js`
- Valida únicamente x-api-key
- Verifica header `x-api-key`
- Compara con `process.env.API_KEY`

---

## 4. ✅ **ROUTER DE PRODUCTOS** (`src/router/producto.router.js`)

### Endpoints configurados:

#### SIN AUTENTICACIÓN:
- `POST /productos` - Crear producto
- `GET /productos` - Listar todos
- `GET /productos/:id` - Obtener por ID

#### CON AUTENTICACIÓN (PROTEGIDOS):
- `PUT /productos/:id` - Editar (requiere x-api-key o JWT)
- `DELETE /productos/:id` - Eliminar (requiere x-api-key o JWT)

Middleware `authenticateToken` se ejecuta ANTES del controller en rutas protegidas.

---

## 5. ✅ **CONTROLLER DE PRODUCTOS** (`src/controller/producto.controller.js`)

### Métodos implementados:

#### `getAllProductos()`
- Retorna lista de todos los productos
- Status: 200

#### `getById(id)`
- Retorna producto específico
- Retorna 404 si no existe

#### `createByJson()`
- Crea nuevo producto
- Valida: producto, stockAmount, fechaIngreso
- Retorna 201 si éxito
- Retorna 422 si validación falla

#### `updateByJson(id)`
- Actualiza parcialmente (full o partial update)
- **PROTEGIDO - requiere autenticación**
- Valida solo los campos enviados
- Usa `updateModel()` para merge de datos

#### `deleteById(id)`
- Elimina producto
- **PROTEGIDO - requiere autenticación**
- Retorna 404 si no existe
- Retorna 200 si éxito

---

## 📋 PRÓXIMOS PASOS

### 1. Actualizar archivos de repositorio
Renombrar/actualizar:
- `src/repository/producto.repository.js` (MySQL)
- `src/repository/producto.mongoose.repository.js` (MongoDB)

Deben incluir métodos:
```javascript
getAll()        // retorna array
getOne(id)      // retorna objeto
createOne(data) // crea y retorna
updateOne(data) // actualiza
deleteOne(id)   // elimina
```

### 2. Variables de entorno (`.env`)
```env
API_KEY=tu-api-key-aqui
JWT_SECRET=tu-secreto-jwt-aqui
DB_PROVIDER=mongo  # o "json" si eliges archivo local
```

### 3. Endpoint `/api/v1/albums/csv` (PENDIENTE)
- Consumir API externa: https://jsonplaceholder.typicode.com/albums
- Tomar primeros 15 items
- Convertir a CSV
- Guardar en `albums_15.csv`
- Retornar CSV en respuesta

### 4. Archivo de tests
Crear `src/test/api.test.http` con ejemplos:
```http
### Crear producto
POST http://localhost:3000/api/v1/productos
Content-Type: application/json

{
  "producto": "Laptop",
  "stockAmount": 5,
  "fechaIngreso": "2025-12-14"
}

### Listar productos
GET http://localhost:3000/api/v1/productos

### Actualizar (con x-api-key)
PUT http://localhost:3000/api/v1/productos/1
Content-Type: application/json
x-api-key: tu-api-key-aqui

{
  "stockAmount": 10
}

### Eliminar (con JWT)
DELETE http://localhost:3000/api/v1/productos/1
Authorization: Bearer <tu-token-jwt>
```

### 5. README.md
Incluir instrucciones sobre:
- Cómo levantar el proyecto (mongo o json)
- Cómo generar x-api-key o JWT
- Ejemplos de requests

---

## ✨ ESTRUCTURA FINAL

```
src/
├── auth/
│   ├── getToken.js
│   └── validateToken.js
├── middlewares/
│   ├── validateApiKey.js
│   └── verifyToken.js
├── validators/
│   └── validators.model.js         ✅ ACTUALIZADO
├── model/
│   └── producto.model.js           ✅ ACTUALIZADO
├── controller/
│   └── producto.controller.js      ✅ ACTUALIZADO
├── router/
│   └── producto.router.js          ✅ ACTUALIZADO
├── repository/
│   ├── producto.repository.js      ⏳ POR ACTUALIZAR
│   └── producto.mongoose.repository.js ⏳ POR ACTUALIZAR
└── ...
```

---

## 🔐 REGLAS DE NEGOCIO IMPLEMENTADAS

✅ Al crear producto: `stockAmount` >= 0
✅ Incremento mínimo de stock: 1 (si lo implementas)
✅ Fecha por defecto: YYYY-MM-DD actual
✅ Producto: string no vacío, max 200 chars
✅ PUT/DELETE requieren autenticación
✅ GET/POST públicos (sin auth)

---

**Próximo: Actualizar repositorios y crear endpoint de CSV**
