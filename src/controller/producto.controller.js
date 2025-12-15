// Importar el repositorio de productos
// Elegir entre MySQL (producto.repository.js) o MongoDB (producto.mongoose.repository.js)
import { ProductoRepository } from "../repository/producto.repository.js";
// import { ProductoRepository } from "../repository/producto.mongoose.repository.js";

// Importar utilidad para actualizar modelos parcialmente
import { updateModel } from "../utils/updateModel.util.js";

// Importar validadores específicos del modelo Producto
import {
    validateProducto,
    validateStockAmount,
    validateIncrementoStock,
    validateFechaIngreso
} from "../validators/validators.model.js";

export const ProductoController = {
    /**
     * GET /api/v1/productos
     * Obtiene todos los productos del stock
     * No requiere autenticación
     */
    getAllProductos: async (request, response) => {
        try {
            // Obtener todos los productos desde el repositorio
            const productos = await ProductoRepository.getAll();

            // Retornar lista de productos con estado 200
            response.status(200).json({
                statusCode: 200,
                payload: productos
            });
        } catch (error) {
            // En caso de error, loguear y retornar error 500
            console.error("Error al obtener productos:", error.message);
            response.status(500).json({
                statusCode: 500,
                error: "Error interno del servidor"
            });
        }
    },

    /**
     * GET /api/v1/productos/:id
     * Obtiene un producto específico por su ID
     * No requiere autenticación
     */
    getById: async (request, response) => {
        const { id } = request.params;

        try {
            // Obtener el producto del repositorio por ID
            const producto = await ProductoRepository.getOne(id);

            // Verificar si el producto existe
            if (!producto) {
                return response.status(404).json({
                    statusCode: 404,
                    error: "Producto no encontrado"
                });
            }

            // Retornar el producto encontrado
            response.status(200).json({
                statusCode: 200,
                payload: producto
            });
        } catch (error) {
            console.error("Error al obtener producto:", error.message);
            response.status(500).json({
                statusCode: 500,
                error: "Error interno del servidor"
            });
        }
    },

    /**
     * POST /api/v1/productos
     * Crea un nuevo producto
     * No requiere autenticación
     * 
     * Body esperado:
     * {
     *   "producto": "string (requerido, no vacío, max 200 chars)",
     *   "stockAmount": "integer (requerido, >= 0)",
     *   "fechaIngreso": "YYYY-MM-DD (opcional, por defecto fecha actual)"
     * }
     */
    createByJson: async (request, response) => {
        const { producto, stockAmount, fechaIngreso } = request.body;

        try {
            // Validar campo: producto
            const { valid: validProducto, error: errorProducto } = validateProducto(producto);
            if (!validProducto) {
                return response.status(422).json({
                    statusCode: 422,
                    error: errorProducto
                });
            }

            // Validar campo: stockAmount (regla: >= 0 al crear)
            const { valid: validStock, error: errorStock } = validateStockAmount(stockAmount);
            if (!validStock) {
                return response.status(422).json({
                    statusCode: 422,
                    error: errorStock
                });
            }

            // Validar campo: fechaIngreso (opcional)
            const { valid: validFecha, error: errorFecha } = validateFechaIngreso(fechaIngreso);
            if (!validFecha) {
                return response.status(422).json({
                    statusCode: 422,
                    error: errorFecha
                });
            }

            // Crear objeto con datos validados
            const nuevoProducto = {
                producto,
                stockAmount,
                ...(fechaIngreso && { fechaIngreso }) // Incluir fecha solo si se proporciona
            };

            // Guardar en base de datos
            const productoCreado = await ProductoRepository.createOne(nuevoProducto);

            // Retornar producto creado con estado 201
            response.status(201).json({
                statusCode: 201,
                payload: productoCreado
            });
        } catch (error) {
            console.error("Error al crear producto:", error.message);
            response.status(500).json({
                statusCode: 500,
                error: "Error interno del servidor"
            });
        }
    },

    /**
     * PUT /api/v1/productos/:id
     * Actualiza un producto existente (full update o partial)
     * REQUIERE autenticación (x-api-key o JWT)
     * 
     * Body esperado (campos opcionales):
     * {
     *   "producto": "string (opcional)",
     *   "stockAmount": "integer (opcional, >= 0)",
     *   "fechaIngreso": "YYYY-MM-DD (opcional)"
     * }
     */
    updateByJson: async (request, response) => {
        const { id } = request.params;
        const productoInput = request.body;

        try {
            // Obtener producto actual de la base de datos
            const productoFromDatabase = await ProductoRepository.getOne(id);

            // Verificar si el producto existe
            if (!productoFromDatabase) {
                return response.status(404).json({
                    statusCode: 404,
                    error: "Producto no encontrado"
                });
            }

            // Validar campos si se proporcionan (validación selectiva para partial update)

            // Si se proporciona 'producto', validarlo
            if (productoInput.producto !== undefined) {
                const { valid: validProducto, error: errorProducto } = validateProducto(productoInput.producto);
                if (!validProducto) {
                    return response.status(422).json({
                        statusCode: 422,
                        error: errorProducto
                    });
                }
            }

            // Si se proporciona 'stockAmount', validarlo
            if (productoInput.stockAmount !== undefined) {
                const { valid: validStock, error: errorStock } = validateStockAmount(productoInput.stockAmount);
                if (!validStock) {
                    return response.status(422).json({
                        statusCode: 422,
                        error: errorStock
                    });
                }
            }

            // Si se proporciona 'fechaIngreso', validarlo
            if (productoInput.fechaIngreso !== undefined) {
                const { valid: validFecha, error: errorFecha } = validateFechaIngreso(productoInput.fechaIngreso);
                if (!validFecha) {
                    return response.status(422).json({
                        statusCode: 422,
                        error: errorFecha
                    });
                }
            }

            // Usar la función updateModel para mezclar datos actuales con nuevos datos
            // (solo actualiza los campos proporcionados, conserva el resto)
            const updatedData = updateModel(
                {
                    id: productoFromDatabase.id,
                    producto: productoFromDatabase.producto,
                    stockAmount: productoFromDatabase.stockAmount,
                    fechaIngreso: productoFromDatabase.fechaIngreso
                },
                productoInput
            );

            // Guardar cambios en base de datos
            await ProductoRepository.updateOne(updatedData);

            // Retornar confirmación de actualización
            response.status(200).json({
                statusCode: 200,
                payload: {
                    message: `Producto '${updatedData.producto}' actualizado exitosamente`
                }
            });
        } catch (error) {
            console.error("Error al actualizar producto:", error.message);
            response.status(500).json({
                statusCode: 500,
                error: "Error interno del servidor"
            });
        }
    },

    /**
     * DELETE /api/v1/productos/:id
     * Elimina un producto existente
     * REQUIERE autenticación (x-api-key o JWT)
     */
    deleteById: async (request, response) => {
        const { id } = request.params;

        try {
            // Obtener producto a eliminar
            const producto = await ProductoRepository.getOne(id);

            // Verificar si el producto existe
            if (!producto) {
                return response.status(404).json({
                    statusCode: 404,
                    error: "Producto no encontrado"
                });
            }

            // Eliminar producto de base de datos
            await ProductoRepository.deleteOne(id);

            // Retornar confirmación de eliminación
            response.status(200).json({
                statusCode: 200,
                payload: {
                    message: `Producto '${producto.producto}' eliminado exitosamente`
                }
            });
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            response.status(500).json({
                statusCode: 500,
                error: "Error interno del servidor"
            });
        }
    }
};