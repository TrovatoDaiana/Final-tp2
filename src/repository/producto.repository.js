import { BookModel } from "../model/book.model.js"

/**Quiero implementar la capa por medio de sequelize
 * Porque? OR; -> Bases de datos SQL
 * https://sequelize.org/
*/


export const BookRepository = {
    getAll: async () => {
        return await BookModel.findAll()
    },

    getOne: async (id) => {
        return await BookModel.findOne({ where: { id } })
    },
    deleteOne: async (id) => {
        return await BookModel.destroy({ where: { id } })
    },
    updateOne: async ({ id, name, category, created_date }) => {
        return await BookModel.update({
            name, category, created_date
        }, { where: { id } })
    },
    createOne: async ({ name, category }) => {
        return await BookModel.create({ name, category })
    }


}