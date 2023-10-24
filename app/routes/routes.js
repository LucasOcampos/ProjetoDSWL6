const ProductsController = require("../controller/productsControllers")

module.exports = {
    getAllProducts: (app) => {
        app.get('/api/products', ProductsController.getAllProducts)
    },
    getProductByID: (app) => {
        app.get('/api/products/:id', ProductsController.getProductByID)
    },
    insertOneProduct: (app) => {
        app.post('/api/products/', ProductsController.insertOneProduct)
    },
    deleteProduct: (app) => {
        app.delete('/api/products/:id', ProductsController.deleteProduct)
    },
    patchProduct: (app) => {
        app.patch('/api/products/:id', ProductsController.patchProduct)
    },
}