import express from "express"
// Importar el router de productos
import ProductoRouter from "./router/producto.router.js"

const server = express()

// Middleware para parsear JSON en el body de las requests
server.use(express.json())

// Registrar router de productos en la ruta base /api/v1
// Esto hace que los endpoints sean:
// POST   /api/v1/productos
// GET    /api/v1/productos
// GET    /api/v1/productos/:id
// PUT    /api/v1/productos/:id
// DELETE /api/v1/productos/:id
server.use("/api/v1", ProductoRouter)

// Middleware catch-all para endpoints no encontrados (404)
server.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    error: "El endpoint no está disponible: " + req.url
  });
});

export default server
