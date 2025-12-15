import { config } from "../config/config.js";

/**
 * Middleware que valida únicamente x-api-key
 * Se utiliza en rutas que requieren únicamente autenticación por API Key
 * (no soporta JWT)
 * 
 * @param {object} request - Objeto de solicitud HTTP
 * @param {object} response - Objeto de respuesta HTTP
 * @param {function} next - Función para continuar al siguiente middleware/controller
 */
export const validateApiKey = (request, response, next) => {
  // Obtener x-api-key del header de la solicitud
  const apiKey = request.headers["x-api-key"];
  
  // Obtener la API key válida desde configuración
  const validApiKey = config.API_KEY || "tu-api-key-aqui";

  // Verificar que se proporcionó una API key en el header
  if (!apiKey) {
    return response.status(401).json({
      statusCode: 401,
      error: "Se requiere x-api-key en el header"
    });
  }

  // Verificar que la API key es válida (coincide con la configurada)
  if (apiKey !== validApiKey) {
    return response.status(403).json({
      statusCode: 403,
      error: "API Key inválida"
    });
  }

  // Si todo es válido, continuar al siguiente middleware/controller
  next();
};

