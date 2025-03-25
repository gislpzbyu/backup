// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/", invController.buildInventory);

// Route to build add new classification view
router.get("/add-classification", invController.buildAddNewClassification);



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.post("/add-classification", invController.addNewClassification);


// Route to build add new inventory view
router.get("/add-inventory", invController.buildAddNewInventory);

// Add New Route post


module.exports = router;