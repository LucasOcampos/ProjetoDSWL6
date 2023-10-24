const ProductsModels = require("../model/productModels")
const Joi = require('joi');

const insertOneProductSchema = Joi.object({
    nome: Joi.string().required().min(1).max(50),
    preco: Joi.number().required(),
    urlImagem: Joi.string().uri().required(),
    quantidade: Joi.number().integer().required(),
    marca: Joi.string().required().min(1).max(50)
})

const patchProductSchema = Joi.object().keys({
    nome: Joi.string().min(1).max(50),
    preco: Joi.number(),
    urlImagem: Joi.string().uri(),
    quantidade: Joi.number().integer(),
    marca: Joi.string().min(1).max(50)
})

module.exports = class ProductsController {
    static async getAllProducts(_, res) {
        console.log('[Products Controller] getAllProducts')

        try {
            const products = await ProductsModels.getAllProducts()

            if (!products) {
                res.status(404).json("There is no product registered!")
            }

            console.log(`[Products Controller] ${products}`)

            res.status(200).json(products)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({error: error})
        }
    }

    static async getProductByID(req, res) {
        console.log('[Products Controller] getProductByID')

        try {
            const product = await ProductsModels.getProductByID(req.params.id)

            if (!product) {
                res.status(404).json("There is no product registered!")
            }

            console.log(`[Products Controller] ${product}`)

            res.status(200).json(product)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({error: error})
        }
    }

    static async insertOneProduct(req, res) {
        console.log('[Products Controller] insertOneProduct')
        const {error, _} = insertOneProductSchema.validate(req.body)

        if (error) {
            const result = {
                msg: 'Product(s) not inserted, fill in the data with the properly.',
                error: error.details
            }
            res.status(404).json(result);
            return;
        }

        try {
            const addedProduct = await ProductsModels.insertOneProduct(req.body)

            res.status(200).json(addedProduct)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({error: error})
        }
    }

    static async deleteProduct(req, res) {
        console.log('[Products Controller] deleteProduct')

        const id = req.params.id

        try {
            const product = await ProductsModels.deleteProductByID(id)

            if (!product.matchedCount) {
                res.status(404).json(`No product found with ID ${id}`)
            } else if (!product.modifiedCount) {
                res.status(404).json(`Product found with ID ${id} was not deleted`)
            }

            res.status(200).json(product)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({error: error})
        }
    }

    static async patchProduct(req, res) {
        console.log('[Products Controller] patchProduct')

        const id = req.params.id
        const updateBody = req.body

        const {error, _} = patchProductSchema.validate(updateBody)

        if (error) {
            const result = {
                msg: 'Fields not updated.',
                error: error.details
            }
            res.status(404).json(result);
            return;
        }

        try {
            const product = await ProductsModels.updateProductByID(
                id,
                updateBody
            )

            if (!product.matchedCount) {
                res.status(404).json(`No product found with ID ${id}`)
            } else if (!product.modifiedCount) {
                res.status(404).json(`Product found with ID ${id} was not deleted`)
            }

            console.log(product)

            res.status(200).json(product)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({error: error})
        }
    }
}