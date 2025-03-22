const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route for the login view (GET)
router.get("/login", accountController.buildLogin);

// Route to process login (POST)
router.post("/login", utilities.handleErrors(accountController.processLogin));

// Route for the registration view (GET)
router.get("/register", accountController.buildRegister);

// Route to process registration (POST)
router.post("/register", utilities.handleErrors(accountController.registerAccount));

// Enhanced error handling middleware
router.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

module.exports = router;