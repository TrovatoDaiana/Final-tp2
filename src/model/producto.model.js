import { DataTypes } from "sequelize"
import { sequelize } from "../database/mysql.cnx.js"

// Modelo de Producto conforme a la consigna del examen final
// Campos requeridos: producto (string), stockAmount (integer >= 0), fechaIngreso (date - opcional)
export const ProductoModel = sequelize.define(
    'Producto', {
    // ID: UUID o Integer generado por el sistema
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // producto: string - REQUERIDO, no puede estar vacío
    producto: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre del producto no puede estar vacío"
            },
            len: {
                args: [1, 200],
                msg: "El producto debe tener entre 1 y 200 caracteres"
            }
        }
    },
    // stockAmount: entero >= 0 - REQUERIDO
    // Regla de negocio: Al crear, debe ser >= 0
    stockAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El stock debe ser mayor o igual a 0"
            },
            isInt: {
                msg: "El stock debe ser un número entero"
            }
        }
    },
    // fechaIngreso: date (ISO 8601 formato YYYY-MM-DD) - OPCIONAL
    // Por defecto se asigna la fecha actual en formato YYYY-MM-DD
    fechaIngreso: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: true
    }
}, {
    tableName: 'producto',
    timestamps: false
}

)

