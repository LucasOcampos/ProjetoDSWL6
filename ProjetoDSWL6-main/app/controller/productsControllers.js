const ProductsModels = require("../model/productModels")
const Joi = require('joi');
const jwt = require('jsonwebtoken')

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

const userSchema = Joi.object().keys({
    username: Joi.string().min(1).required(),
    password: Joi.string().required(),
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
            res.status(500).json({ error: error })
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
            res.status(500).json({ error: error })
        }
    }

    static async insertOneProduct(req, res) {
        console.log('[Products Controller] insertOneProduct')
        const { error, _ } = insertOneProductSchema.validate(req.body)

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
            res.status(500).json({ error: error })
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
            res.status(500).json({ error: error })
        }
    }

    static async patchProduct(req, res) {
        console.log('[Products Controller] patchProduct')

        const id = req.params.id
        const updateBody = req.body

        const { error, _ } = patchProductSchema.validate(updateBody)

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
                res.status(404).json(`Product found with ID ${id} was not updated`)
            }

            console.log(product)

            res.status(200).json(product)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({ error: error })
        }
    }

    static async createUser(req, res) {
        console.log('[Products Controller] createUser')
        const { error, _ } = userSchema.validate(req.body)

        if (error) {
            const result = {
                msg: 'User not inserted, fill in the data with the properly.',
                error: error.details
            }
            res.status(404).json(result);
            return;
        }

        try {
            const addedUser = await ProductsModels.createUser(req.body)
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: addedUser.insertedId, username: addedUser.username },
                process.env.secretKey,
                {
                    expiresIn: maxAge, // 3hrs
                }
            );

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs
            });

            res.status(200).json(addedUser)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({ error: error })
        }
    }

    static async loginUser(req, res) {
        console.log('[Products Controller] loginUser')
        const { error, _ } = userSchema.validate(req.body)

        if (error) {
            const result = {
                msg: 'Fill in the data with the properly.',
                error: error.details
            }
            res.status(404).json(result);
            return;
        }

        try {
            const foundUser = await ProductsModels.loginUser(req.body)
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: foundUser._id, username: foundUser.username },
                process.env.secretKey,
                {
                    expiresIn: maxAge, // 3hrs
                }
            );

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs
            });

            res.status(200).json(foundUser)
        } catch (error) {
            console.log(`[Products Controller Error] ${error}`)
            res.status(500).json({ error: error })
        }
    }

    static userAuth(req, res, next) {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, process.env.secretKey, (err, _) => {
                if (err) {
                    return res.status(401).json({ message: "Not authorized" })
                }

                next()
            })
        } else {
            return res
                .status(401)
                .json({ message: "Not logged in" })
        }
    }
}