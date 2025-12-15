import dotenv from 'dotenv'

dotenv.config()

// Extraer variables de entorno necesarias para la aplicación
const {
    // Variables de base de datos MySQL
    MYSQL_DB,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_HOST,
    MYSQL_PORT,
    
    // Variables de base de datos MongoDB
    MONGO_URI,
    
    // Configuración de base de datos
    DIALECT,
    
    // Configuración del servidor
    SERVER_PORT,
    SERVER_HOST,
    
    // Variables de autenticación
    API_KEY,           // Clave para autenticación x-api-key
    JWT_SECRET         // Secreto para tokens JWT
} = process.env

// Exportar objeto de configuración con todas las variables
export const config = {
    MYSQL_DB,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_HOST,
    MYSQL_PORT,
    MONGO_URI,
    DIALECT,
    SERVER_PORT,
    SERVER_HOST,
    API_KEY,
    JWT_SECRET
}
