const express = require('express')
const cookieParser = require("cookie-parser");

const app = express()
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", "./app/views")

app.use(express.static("./public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.listen(port, function () {
    console.log(`Servidor rodando com express na porta ${port}`)
})

module.exports = app