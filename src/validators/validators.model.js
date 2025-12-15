// Validadores específicos para el modelo de Producto
// Todos los validadores retornan un objeto con { valid: boolean, error?: string }

/**
 * Valida que el nombre del producto no esté vacío y tenga un formato válido
 * @param {string} producto - Nombre del producto a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateProducto = (producto) => {
    // Verificar que producto existe y no es null/undefined
    if (!producto) {
        return { valid: false, error: "El nombre del producto es requerido" }
    }

    // Verificar que es de tipo string
    if (typeof producto !== 'string') {
        return { valid: false, error: "El producto debe ser un texto (string)" }
    }

    // Verificar que no esté vacío (sin espacios en blanco)
    if (producto.trim().length === 0) {
        return { valid: false, error: "El producto no puede estar vacío" }
    }

    // Verificar longitud máxima
    if (producto.length > 200) {
        return { valid: false, error: "El producto no debe exceder 200 caracteres" }
    }

    return { valid: true }
}

/**
 * Valida que el stock sea un número entero mayor o igual a 0
 * @param {number} stockAmount - Cantidad de stock a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateStockAmount = (stockAmount) => {
    // Verificar que existe y no es null/undefined
    if (stockAmount === null || stockAmount === undefined) {
        return { valid: false, error: "El stock es requerido" }
    }

    // Convertir a número si es string
    const stock = Number(stockAmount)

    // Verificar que es un número válido
    if (isNaN(stock)) {
        return { valid: false, error: "El stock debe ser un número" }
    }

    // Verificar que es un entero (sin decimales)
    if (!Number.isInteger(stock)) {
        return { valid: false, error: "El stock debe ser un número entero" }
    }

    // Verificar que es >= 0 (regla de negocio)
    if (stock < 0) {
        return { valid: false, error: "El stock debe ser mayor o igual a 0" }
    }

    return { valid: true }
}

/**
 * Valida que el incremento de stock sea válido (mínimo 1)
 * @param {number} incremento - Cantidad a incrementar
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateIncrementoStock = (incremento) => {
    // Verificar que existe
    if (incremento === null || incremento === undefined) {
        return { valid: false, error: "El incremento es requerido" }
    }

    const inc = Number(incremento)

    // Verificar que es número
    if (isNaN(inc)) {
        return { valid: false, error: "El incremento debe ser un número" }
    }

    // Verificar que es entero
    if (!Number.isInteger(inc)) {
        return { valid: false, error: "El incremento debe ser un número entero" }
    }

    // Verificar que es >= 1 (regla de negocio: incremento mínimo es 1)
    if (inc < 1) {
        return { valid: false, error: "El incremento mínimo es 1" }
    }

    return { valid: true }
}

/**
 * Valida que la fecha esté en formato ISO 8601 (YYYY-MM-DD)
 * @param {string} fecha - Fecha a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateFechaIngreso = (fecha) => {
    // Si no se proporciona fecha, es válido (es opcional y se asigna por defecto)
    if (!fecha) {
        return { valid: true }
    }

    // Verificar formato ISO 8601 (YYYY-MM-DD)
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/
    if (!regexFecha.test(fecha)) {
        return { valid: false, error: "La fecha debe estar en formato YYYY-MM-DD" }
    }

    // Verificar que es una fecha válida
    const date = new Date(fecha)
    if (isNaN(date.getTime())) {
        return { valid: false, error: "La fecha proporcionada no es válida" }
    }

    return { valid: true }
}
