import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Valida y verifica un token JWT
 * @param {string} token - Token JWT a validar (sin "Bearer ")
 * @returns {Object} { isValid: boolean, decoded?: object, error?: string }
 */
export const validateToken = async (token) => {
  try {
    // Obtener el secreto JWT de las variables de entorno
    // En producción, siempre debe venir de config.JWT_SECRET
    const secret = config.JWT_SECRET || "tu-secret-aqui";

    // Verificar y decodificar el token
    // Si la firma no es válida o está expirado, lanza error
    const decoded = jwt.verify(token, secret);

    // Token válido - retornar decoded payload
    return { isValid: true, decoded };
  } catch (err) {
    // Token inválido, expirado o error en verificación
    console.error("Error validating token:", err.message);
    return { isValid: false, error: err.message };
  }
};
