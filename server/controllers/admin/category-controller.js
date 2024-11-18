const Category = require("../../models/Category");

// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists (case-insensitive check)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      data: savedCategory,
      success: true,
    });
  } catch (error) {
    console.error("Server Error: ", error); // Log server errors for debugging
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Fetch all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ data: categories });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Edit an existing category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    // Find the category by ID
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category
    category.name = name || category.name;
    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the category by ID
    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "Category deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
};
