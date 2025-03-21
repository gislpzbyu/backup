/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const session = require("express-session");
const pool = require("./database");
const app = express();

// Importar rutas y controladores
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const detailRoute = require("./routes/detailRoute");
const errorController = require("./controllers/errorController");

/* ***********************
 * Middleware
 *************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes);
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use("/detail", detailRoute);

// Ruta para probar un error 500
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Intentional Server Error"));
});

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(errorController.handle404);
app.use(errorController.handle500);

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});