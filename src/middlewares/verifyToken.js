import { getToken } from "../auth/getToken.js";
import { validateToken } from "../auth/validateToken.js";
import { config } from "../config/config.js";

/**
 * Middleware de autenticación que verifica JWT o x-api-key
 * Se ejecuta ANTES que el controller en rutas protegidas (PUT y DELETE)
 * 
 * Soporta dos formas de autenticación:
 * 1. Bearer Token (JWT) en header Authorization: "Bearer <token>"
 * 2. API Key en header x-api-key: "<api-key>"
 * 
 * @param {object} request - Objeto de solicitud HTTP
 * @param {object} response - Objeto de respuesta HTTP
 * @param {function} next - Función para continuar al siguiente middleware/controller
 */
export const authenticateToken = async (request, response, next) => {
  try {
    // Primero intentar validar como JWT
    // Leer el token del header Authorization (formato: "Bearer <token>")
    const token = getToken(request);

    if (token) {
      // Si existe token JWT, intentar validarlo
      const { isValid } = await validateToken(token);

      if (isValid) {
        // Token JWT válido, continuar al siguiente middleware/controller
        return next();
      }
    }

    // Si no hay JWT válido, intentar validar API Key
    const apiKey = request.headers["x-api-key"];
    // Obtener API Key válida desde configuración
    const validApiKey = config.API_KEY || "tu-api-key-aqui";

    if (apiKey && apiKey === validApiKey) {
      // API Key válida, continuar al siguiente middleware/controller
      return next();
    }

    // Si no hay token JWT válido ni API Key válida, retornar error 401
    return response.status(401).json({
      statusCode: 401,
      error: "Acceso denegado. Se requiere autenticación (x-api-key o JWT válido)"
    });

  } catch (err) {
    // Error interno del servidor
    console.error("Auth-Middleware error:", err);
    return response.status(500).json({
      statusCode: 500,
      error: "Error interno del servidor"
    });
  }
};
