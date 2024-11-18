const Product = require("../../models/Product");
const mongoose = require("mongoose");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    // console.log(keyword);

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    // Create search query for string fields (title, description, etc.)
    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
      ],
    };

    // Search for products that match the keyword in title, description, or brand
    let searchResults = await Product.find(createSearchQuery);

    // Optionally, if you want to filter based on category or brand name, you could join the collections
    if (searchResults.length === 0) {
      // If no products found, search for categories and brands that match the keyword
      const categories = await Category.find({ name: regEx }).select("_id");
      const brands = await Brand.find({ name: regEx }).select("_id");

      const categoryIds = categories.map(category => category._id);
      const brandIds = brands.map(brand => brand._id);

      // Now search for products using category and brand ids
      searchResults = await Product.find({
        $or: [
          { title: regEx },
          { description: regEx },
          { category: { $in: categoryIds } }, // Search by category IDs
          { brand: { $in: brandIds } }, // Search by brand IDs
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
