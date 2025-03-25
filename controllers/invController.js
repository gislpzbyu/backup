const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      return res.status(404).render("errors/404", { title: "Page Not Found" })
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav(req.originalUrl)
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

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

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body

    // Este Cnotrola la inserccion en la base de datos, hazlo parecido] invModel.AddNewClas...
    await invModel.addNewClassification(classification_name)
    res.redirect("/inv")
  } catch (error) {
    next(error)
  }
}

invCont.buildAddNewInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(req.originalUrl)
    res.render("./inventory/add-inventory", { title: "Add New Inventory", nav })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
