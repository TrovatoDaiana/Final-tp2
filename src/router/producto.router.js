import express from "express"
import { ProductoController } from "../controller/producto.controller.js"
// Importar middlewares de autenticación
import { authenticateToken } from "../middlewares/verifyToken.js"
import { validateApiKey } from "../middlewares/validateApiKey.js"

const ProductoRouter = express.Router()

// ENDPOINTS PÚBLICOS (sin autenticación requerida)
// POST /api/v1/productos - Crear producto. No requiere autenticación
ProductoRouter.post("/productos", ProductoController.createByJson)

// GET /api/v1/productos - Listar todos los productos. No requiere autenticación
ProductoRouter.get("/productos", ProductoController.getAllProductos)

// GET /api/v1/productos/:id - Obtener producto por ID. No requiere autenticación
ProductoRouter.get("/productos/:id", ProductoController.getById)

// ENDPOINTS PROTEGIDOS (requieren autenticación x-api-key o JWT)
// PUT /api/v1/productos/:id - Editar producto. REQUIERE autenticación
// El middleware (authenticateToken o validateApiKey) se ejecuta antes que el controller
ProductoRouter.put(
    "/productos/:id",
    authenticateToken, // Middleware que valida JWT o x-api-key
    ProductoController.updateByJson
)

// DELETE /api/v1/productos/:id - Eliminar producto. REQUIERE autenticación
ProductoRouter.delete(
    "/productos/:id",
    authenticateToken, // Middleware que valida JWT o x-api-key
    ProductoController.deleteById
)

export default ProductoRouter
