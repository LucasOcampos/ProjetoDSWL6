const client = require("../../config/dbConnection");
const ObjectId = require('mongodb').ObjectId

module.exports = class ProductsModels {
    static async getAllProducts() {
        console.log("[Products Models] getAllProducts")

        let query = {deleted_at: null}

        const cursor = await client.db("MercadoVegano").collection("produtos").find(query)

        return await cursor.toArray()
    }

    static async getProductByID(id) {
        console.log("[Products Models] getProductByID")
        let objectId = new ObjectId(id)

        let query = {_id: objectId}

        const cursor = await client.db("MercadoVegano").collection("produtos").find(query)

        return await cursor.toArray()
    }

    static async insertOneProduct(data) {
        console.log("[Products Models] insertOneProduct")

        try {
            const newProduct = {
                nome: data.nome,
                preco: data.preco,
                urlImagem: data.urlImagem,
                quantidade: data.quantidade,
                marca: data.marca,
                created_at: new Date(),
                deleted_at: null
            }

            const addedProduct = await client.db("MercadoVegano").collection("produtos").insertOne(newProduct)

            console.log(`New product inserted with the following ID ${addedProduct.insertedId}`)

            return addedProduct
        } catch (error) {
            console.log(`[insertOneProduct] Error: ${error}`)
            throw error
        }
    }

    static async deleteProductByID(id) {
        console.log("[deleteProductByID]")
        let objectId = new ObjectId(id)

        let query = {
            _id: objectId, deleted_at: null
        }

        return await client.db("MercadoVegano").collection("produtos").updateOne(query, {
            $set: {
                deleted_at: new Date()
            }
        })
    }

    static async updateProductByID(id, body) {
        console.log("[updateProductByID]")
        let objectId = new ObjectId(id)

        let query = {
            _id: objectId, deleted_at: null
        }

        return await client.db("MercadoVegano").collection("produtos").updateOne(query, {
            $set: body
        })
    }
}