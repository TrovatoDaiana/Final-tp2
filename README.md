# 📦 API RESTful de Gestión de Productos - Examen Final

**Carrera:** Taller de Programación 2  
**Docente:** Anderson Ocana  
**Alumno:** <TU_NOMBRE>  
**Repositorio:** Final-tp2  
**Rama:** main  

---

## 🎯 Objetivo

Desarrollar una **API RESTful en Node.js con Express** para la gestión de un stock de productos. La API debe soportar operaciones CRUD completas con validación de datos y autenticación en endpoints protegidos.

---

## 📋 Requisitos Cumplidos

### ✅ Persistencia
- MongoDB Atlas (recomendado)
- MySQL (local o remoto)
- Configuración mediante variable `DB_PROVIDER`

### ✅ Seguridad (Middlewares)
- Autenticación por **x-api-key** (header)
- Autenticación por **JWT** (Bearer Token)
- Middlewares reutilizables y aplicables a múltiples rutas
- Protección en endpoints PUT y DELETE

### ✅ Entidad Obligatoria: Producto
**Campos del modelo:**
- `id`: UUID o Integer (generado por el sistema)
- `producto`: string, requerido, no vacío
- `stockAmount`: integer ≥ 0, requerido
- `fechaIngreso`: date (ISO 8601), opcional, por defecto = hoy

**Reglas de negocio:**
- Al crear: stockAmount ≥ 0
- Al incrementar stock: incremento mínimo = 1

### ✅ Endpoints (Rutas y Comportamiento)

| Método | Ruta | Auth | Descripción | Status |
|--------|------|------|-------------|--------|
| **POST** | `/api/v1/productos` | ❌ No | Crear producto. No requiere autenticación | 201 / 422 |
| **GET** | `/api/v1/productos` | ❌ No | Listar todos los productos | 200 |
| **GET** | `/api/v1/productos/:id` | ❌ No | Obtener producto por ID | 200 / 404 |
| **PUT** | `/api/v1/productos/:id` | ✅ Sí | Editar producto. **REQUIERE autenticación** | 200 / 401 / 404 / 422 |
| **DELETE** | `/api/v1/productos/:id` | ✅ Sí | Eliminar producto. **REQUIERE autenticación** | 200 / 401 / 404 |
| **GET** | `/api/v1/albums/csv` | ❌ No | Descargar CSV de álbumes | 200 |

### ✅ Validaciones y Errores
**Formato de error estándar (JSON):**
```json
{
  "statusCode": 400,
  "error": "Mensaje descriptivo del error"
}
```

**Validaciones implementadas:**
- ✅ Campo `producto`: no vacío, 1-200 caracteres
- ✅ Campo `stockAmount`: entero ≥ 0
- ✅ Campo `fechaIngreso`: formato YYYY-MM-DD

### ✅ Tests (Manuales/Semiautomáticos)
Archivo: `src/test/api.test.http`
- ✅ Crear producto
- ✅ Listar productos
- ✅ Obtener producto por ID
- ✅ Intento de update sin autenticación (esperar 401/403)
- ✅ Update con x-api-key válida
- ✅ Update con token JWT válido
- ✅ Delete protegido
- ✅ Endpoint `/api/v1/albums/csv`

### ✅ Organización del Proyecto
```
proyecto-stock-api/
├── app.js                          # Punto de entrada, configuración Express
├── config/
│   └── index.js                    # Variables de entorno
├── controllers/
│   └── productoController.js       # Lógica de negocios
├── models/
│   ├── producto.js                 # Esquema/DTO (no validaciones de negocio)
│   └── producto.mongoose.js        # Modelo MongoDB (si se elige)
├── repositories/
│   ├── productoRepositoryMongo.js  # CRUD MongoDB
│   └── productoRepositoryJson.js   # CRUD JSON local
├── routes/
│   └── productoRoutes.js           # Definición de endpoints
├── services/
│   ├── albumService.js             # Lógica para consumir API externa
│   └── productoService.js          # Lógica de producto (si es que existe)
├── middlewares/
│   ├── authMiddleware.js           # Valida x-api-key o JWT según config
│   └── errorHandler.js             # Manejo centralizado de errores
├── tests/
│   └── test.endpoints.http         # Archivo REST Client para VSCode
├── database/
│   ├── database.json               # (si se elige DB_PROVIDER=json)
│   └── albums_15.csv               # Generado por endpoint /albums/csv
├── .env                            # Variables de entorno (NO COMMITAR)
├── .gitignore                      # Archivos a ignorar
├── package.json                    # Dependencias y scripts
└── README.md                       # Este archivo
```

---

## 🚀 Cómo Levantar el Proyecto

### 1️⃣ Instalación

```bash
# Clonar repositorio
git clone https://github.com/TrovatoDaiana/Final-tp2.git
cd Final-tp2

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
```

### 2️⃣ Configurar Variables de Entorno

Editar `.env` según tu configuración:

```env
# ===== SERVIDOR =====
SERVER_HOST=localhost
SERVER_PORT=3000

# ===== BASE DE DATOS =====
# Opción A: MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PWD=password
MYSQL_DB=proyecto_stock_api
DIALECT=mysql
DB_PROVIDER=mysql

# Opción B: MongoDB (comentar MySQL y descomentar esto)
# MONGO_URI=mongodb://localhost:27017/proyecto_stock_api
# DB_PROVIDER=mongo

# Opción C: JSON local
# DB_PROVIDER=json

# ===== AUTENTICACIÓN =====
API_KEY=mi-clave-api-super-secreta-123
JWT_SECRET=mi-secreto-jwt-super-seguro-456
```

### 3️⃣ Levantar el Servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# O modo producción
npm start
```

**Resultado esperado:**
```
Server is running at: http://localhost:3000
Conexión establecida con: localhost
```

---

## 🔐 Autenticación

### Opción 1: x-api-key (Más simple)

```bash
curl -X PUT http://localhost:3000/api/v1/productos/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: mi-clave-api-super-secreta-123" \
  -d '{"stockAmount": 10}'
```

### Opción 2: JWT (Bearer Token)

```bash
curl -X PUT http://localhost:3000/api/v1/productos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"stockAmount": 10}'
```

### Generar JWT Token

Opción A: Usar herramienta online [jwt.io](https://jwt.io)
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload: `{ "id": 1, "email": "usuario@example.com" }`
- Secret: `mi-secreto-jwt-super-seguro-456`

Opción B: Usar CLI
```bash
npm install -g jwt-cli
jwt encode '{"id":1}' mi-secreto-jwt-super-seguro-456
```

---

## 📝 Ejemplos de Requests

### Crear Producto
```http
POST /api/v1/productos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "producto": "Laptop Dell XPS 15",
  "stockAmount": 5,
  "fechaIngreso": "2025-12-14"
}

# Respuesta 201:
{
  "statusCode": 201,
  "payload": {
    "id": 1,
    "producto": "Laptop Dell XPS 15",
    "stockAmount": 5,
    "fechaIngreso": "2025-12-14"
  }
}
```

### Listar Productos
```http
GET /api/v1/productos HTTP/1.1
Host: localhost:3000

# Respuesta 200:
{
  "statusCode": 200,
  "payload": [
    {
      "id": 1,
      "producto": "Laptop Dell XPS 15",
      "stockAmount": 5,
      "fechaIngreso": "2025-12-14"
    }
  ]
}
```

### Obtener Producto
```http
GET /api/v1/productos/1 HTTP/1.1
Host: localhost:3000

# Respuesta 200:
{
  "statusCode": 200,
  "payload": {
    "id": 1,
    "producto": "Laptop Dell XPS 15",
    "stockAmount": 5,
    "fechaIngreso": "2025-12-14"
  }
}

# Respuesta 404 (no existe):
{
  "statusCode": 404,
  "error": "Producto no encontrado"
}
```

### Actualizar Producto (Protegido)
```http
PUT /api/v1/productos/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
x-api-key: mi-clave-api-super-secreta-123

{
  "stockAmount": 15
}

# Respuesta 200:
{
  "statusCode": 200,
  "payload": {
    "message": "Producto 'Laptop Dell XPS 15' actualizado exitosamente"
  }
}

# Respuesta 401 (sin autenticación):
{
  "statusCode": 401,
  "error": "Acceso denegado. Se requiere autenticación (x-api-key o JWT válido)"
}
```

### Eliminar Producto (Protegido)
```http
DELETE /api/v1/productos/1 HTTP/1.1
Host: localhost:3000
x-api-key: mi-clave-api-super-secreta-123

# Respuesta 200:
{
  "statusCode": 200,
  "payload": {
    "message": "Producto 'Laptop Dell XPS 15' eliminado exitosamente"
  }
}
```

---

## 🧪 Probar con REST Client (VS Code)

1. Instala extensión: **REST Client** (Huachao Mao)
2. Abre archivo: `src/test/api.test.http`
3. Haz clic en **"Send Request"** sobre cada request
4. O presiona **Ctrl+Alt+R**

---

## 📊 Estructura de Respuestas

### Respuesta Exitosa (2xx)
```json
{
  "statusCode": 200,
  "payload": { /* datos */ }
}
```

### Respuesta de Error (4xx/5xx)
```json
{
  "statusCode": 400,
  "error": "Mensaje descriptivo del error"
}
```

---

## 🔄 Flujo Completo de Uso

1. **Crear** producto
   ```bash
   POST /api/v1/productos
   ```

2. **Listar** productos
   ```bash
   GET /api/v1/productos
   ```

3. **Obtener** producto específico
   ```bash
   GET /api/v1/productos/1
   ```

4. **Actualizar** producto (requiere auth)
   ```bash
   PUT /api/v1/productos/1 -H "x-api-key: ..."
   ```

5. **Eliminar** producto (requiere auth)
   ```bash
   DELETE /api/v1/productos/1 -H "x-api-key: ..."
   ```

6. **Descargar** CSV de álbumes
   ```bash
   GET /api/v1/albums/csv
   ```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `Error: Cannot find module 'express'` | Ejecutar `npm install` |
| `Port 3000 already in use` | Cambiar `SERVER_PORT` en `.env` o matar proceso en puerto 3000 |
| `Error: connect ECONNREFUSED` (MySQL) | Verificar que MySQL esté corriendo en `MYSQL_HOST:MYSQL_PORT` |
| `MongooseError: Cannot connect to MongoDB` | Verificar `MONGO_URI` en `.env` |
| `401 Unauthorized` | Verificar que `x-api-key` o JWT sea válido |
| `422 Unprocessable Entity` | Verificar que datos cumplen validaciones |

---

## 📚 Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Autenticación:** JWT (jsonwebtoken)
- **Bases de Datos:** MongoDB / MySQL / JSON
- **ORM:** Sequelize (MySQL) / Mongoose (MongoDB)
- **Validación:** Secuelize validators
- **HTTP Client:** REST Client (VS Code)
- **Versionado:** Git/GitHub

---

## 📄 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `app.js` | Punto de entrada principal |
| `src/server.js` | Configuración de Express |
| `src/config/config.js` | Variables de entorno |
| `src/model/producto.model.js` | Modelo de datos |
| `src/controller/producto.controller.js` | Controladores de endpoints |
| `src/router/producto.router.js` | Definición de rutas |
| `src/middlewares/verifyToken.js` | Middleware de autenticación |
| `src/validators/validators.model.js` | Validadores de datos |
| `src/test/api.test.http` | Tests manuales |
| `.env.example` | Ejemplo de variables de entorno |
| `.gitignore` | Archivos ignorados por Git |

---

## 🎓 Conceptos Clave Implementados

✅ **Estructura MVC:** Model-View-Controller  
✅ **Middlewares:** Autenticación y error handling  
✅ **Validación:** De datos en entrada  
✅ **REST API:** Endpoints RESTful completos  
✅ **Seguridad:** Autenticación x-api-key y JWT  
✅ **Manejo de errores:** Respuestas estandarizadas  
✅ **Configuración:** Variables de entorno  
✅ **Versionado:** Git con .gitignore  

---

## 📞 Contacto

**Alumno:** [Tu nombre]  
**Email:** [Tu email]  
**GitHub:** [Tu perfil de GitHub]  
**Repositorio:** https://github.com/TrovatoDaiana/Final-tp2

---

## 📜 Licencia

Este proyecto es de uso educativo.

---

**Última actualización:** 14 de Diciembre de 2025  
**Estado:** ✅ Completo - Listo para producción
