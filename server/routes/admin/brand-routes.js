const express = require("express");
const router = express.Router();
const {
  addBrand,
  getAllBrands,
  editBrand,
  deleteBrand,
} = require("../../controllers/admin/brand-controller"); // Import the controller

// Add a new brand
router.post("/add", addBrand);

// Get all brands
router.get("/get", getAllBrands);

// Edit a brand
router.put("/edit/:id", editBrand);

// Delete a brand
router.delete("/delete/:id", deleteBrand);

module.exports = router;
