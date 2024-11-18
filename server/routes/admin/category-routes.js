const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
} = require("../../controllers/admin/category-controller"); // Import the controller

// Add a new category
router.post("/add", addCategory);

// Get all categories
router.get("/get", getAllCategories);

// Edit a category
router.put("/edit/:id", editCategory);

// Delete a category
router.delete("/delete/:id", deleteCategory);

module.exports = router;
