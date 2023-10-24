const app = require('./config/server')
const routes = require('./app/routes/routes')

routes.getAllProducts(app)
routes.getProductByID(app)
routes.insertOneProduct(app)
routes.deleteProduct(app)
routes.patchProduct(app)