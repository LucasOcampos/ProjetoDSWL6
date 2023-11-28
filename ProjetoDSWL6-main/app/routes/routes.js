const ProductsController = require("../controller/productsControllers")

module.exports = {
    getAllProducts: (app) => {
        app.get('/api/products', ProductsController.userAuth, ProductsController.getAllProducts)
    },
    getProductByID: (app) => {
        app.get('/api/products/:id', ProductsController.userAuth, ProductsController.getProductByID)
    },
    insertOneProduct: (app) => {
        app.post('/api/products', ProductsController.userAuth, ProductsController.insertOneProduct)
    },
    deleteProduct: (app) => {
        app.delete('/api/products/:id', ProductsController.userAuth, ProductsController.deleteProduct)
    },
    patchProduct: (app) => {
        app.patch('/api/products/:id', ProductsController.userAuth, ProductsController.patchProduct)
    },
    createUser: (app) => {
        app.post('/api/createUser', ProductsController.createUser)
    },
    loginUser: (app) => {
        app.post('/api/login', ProductsController.loginUser)
    },
}