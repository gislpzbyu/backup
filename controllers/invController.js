const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    console.log("data recibida:", data);

    let nav = await utilities.getNav(req.originalUrl);

    let grid;
    let className = "Unknown";

    if (Array.isArray(data) && data.length > 0) {
      grid = await utilities.buildClassificationGrid(data);
      className = data[0].classification_name;
    } else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.log("error 😏", error);
    next(error);
  }
};


invCont.buildInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(req.originalUrl)
    res.render("./inventory/index", { title: "Inventory", nav })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddNewClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(req.originalUrl)

    res.render("./inventory/add-classification", { title: "Add New Classification", nav })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddNewInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(req.originalUrl)
    const classifications = await invModel.getClassifications(); // Obtén las clasificaciones
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classifications: classifications.rows, // Envía las clasificaciones a la vista
    })
  } catch (error) {
    next(error)
  }
}

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;

    // Validamos que classification_name no esté vacío y sea un string válido
    if (!classification_name || typeof classification_name !== "string" || classification_name.trim() === "") {
      req.flash("notice", "Error: Classification cannot be empty and must be a valid text.");
      return res.redirect("/inv/add-classification"); // Ajusta la ruta según tu aplicación
    }

    // Insertar la nueva clasificación en la base de datos
    // await invModel.addNewClassification(classification_name);

    // Mensaje de éxito y redirección
    req.flash("notice", "¡Clasificación agregada exitosamente!");
    // res.redirect("/inv");
  } catch (error) {
    console.error("Error al agregar clasificación:", error);
    req.flash("notice", "Error inesperado al agregar la clasificación.");
    next(error);
  }
};


invCont.addNewInventory = async function (req, res, next) {
  try {
    const { classification_ } = req.body;

    await invModel.addNewInventory({ ...req.body, classification_: classification_.toString() });

    res.redirect(`/inv/type/${classification_}`)
  } catch (error) {
    console.log('Error while adding new inventory',error);
    next(error)
  }
}


module.exports = invCont
