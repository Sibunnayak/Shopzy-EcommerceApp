const Brand = require("../../models/Brand");

// Add a new brand
const addBrand = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if brand already exists (case-insensitive check)
    const existingBrand = await Brand.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const newBrand = new Brand({ name });
    const savedBrand = await newBrand.save();

    return res.status(201).json({
      message: "Brand added successfully",
      data: savedBrand,
      success: true,
    });
  } catch (error) {
    console.error("Server Error: ", error); // Log server errors for debugging
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Fetch all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json({ data: brands });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Edit an existing brand
const editBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    // Find the brand by ID
    const existingBrand = await Brand.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Update the brand
    brand.name = name || brand.name;
    const updatedBrand = await brand.save();

    return res.status(200).json({
      message: "Brand updated successfully",
      data: updatedBrand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete a brand
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the brand by ID
    const result = await Brand.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Brand not found" });
    }

    return res
      .status(200)
      .json({ message: "Brand deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addBrand,
  getAllBrands,
  editBrand,
  deleteBrand,
};
