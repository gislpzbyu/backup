/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv").config()
const app = express()

// Importar rutas y controladores
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const detailRoute = require("./routes/detailRoute")
const errorController = require("./controllers/errorController") // Nuevo controlador de errores

/* ***********************
 * Middleware
 *************************/
app.use(express.json()) // Para procesar JSON
app.use(express.urlencoded({ extended: true })) // Para formularios
app.use(express.static("public")) // Para servir archivos estáticos (CSS, JS, imágenes)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Asegura que el layout esté bien configurado

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/detail", detailRoute)

// Ruta para probar un error 500
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional Server Error")) // Disparar un error 500
})

/* ***********************
 * Error Handling Middleware
 *************************/

// 404 Error Handler
app.use(errorController.handle404)
// 500 Error Handler
app.use(errorController.handle500)

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
