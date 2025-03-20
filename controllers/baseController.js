const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){

  const nav = await utilities.getNav(req.originalUrl);
  res.render("index", {title: "Home", nav})
}

module.exports = baseController