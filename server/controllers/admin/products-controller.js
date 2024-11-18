const {
  imageUploadUtil,
  imageDeleteUtil,
} = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    // console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    // Destructuring the product data from the request body
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      discountPercentage,
      totalStock,
      averageReview,
      colors, // This will be a space-separated string
      sizes, // This will be a space-separated string
    } = req.body;

    // console.log(req.body, "req.body");
    // console.log(averageReview, "averageReview");

    // Calculate the salePrice based on the price and discountPercentage
    const salePrice = price - (price * discountPercentage) / 100;

    // Convert colors and sizes to arrays by splitting the space-separated strings
    const colorsArray = colors.split(",").map((color) => color.trim());
    const sizesArray = sizes.split(",").map((size) => size.trim());
    // Create a new Product object with the calculated salePrice and transformed arrays
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      colors: colorsArray,
      sizes: sizesArray,
      discountPercentage,
    });

    // Save the newly created product to the database
    await newlyCreatedProduct.save();

    // Respond with success and the newly created product
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({})
      .populate("category", "name")
      .populate("brand", "name");
    // Format the result to send category and brand names instead of their ObjectIds
    const formattedProducts = listOfProducts.map((product) => {
      return {
        ...product.toObject(),
        category: product.category.name,
        brand: product.brand.name,
      };
    });
    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      discountPercentage,
      salePrice,
      totalStock,
      averageReview,
      colors,
      sizes,
    } = req.body;
    // console.log(req.body, "req.body");
    // Find the product by ID
    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // If price is updated, update the price as well
    findProduct.price = price !== undefined ? price : findProduct.price;

    // If discountPercentage is updated, update the salePrice as well
    findProduct.discountPercentage =
      discountPercentage !== undefined
        ? discountPercentage
        : findProduct.discountPercentage;
    // Calculate salePrice if not provided (using price and discountPercentage)
    const calculatedSalePrice =
      findProduct.price -
      (findProduct.price * findProduct.discountPercentage) / 100;
    findProduct.salePrice =
      calculatedSalePrice !== undefined
        ? calculatedSalePrice
        : findProduct.salePrice;

    // Split colors and sizes into arrays if they are provided
    if (colors && !Array.isArray(colors)) {
      findProduct.colors = colors.split(",").map((color) => color.trim());
    } else if (Array.isArray(colors)) {
      findProduct.colors = colors; // Directly assign if it's already an array
    }

    if (sizes && !Array.isArray(sizes)) {
      findProduct.sizes = sizes.split(",").map((size) => size.trim());
    } else if (Array.isArray(sizes)) {
      findProduct.sizes = sizes; // Directly assign if it's already an array
    }

    // Update other fields if they are provided
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    // console.log(findProduct, "findProduct");
    // Save the updated product
    await findProduct.save();

    // Respond with the updated product data
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    const publicId = product.image.split("/").pop().split(".")[0]; // Extracts the string between the last "/" and ".jpg"
    // console.log(publicId, "publicId");

    // Delete the image from Cloudinary
    const cloudinaryResponse = await imageDeleteUtil(publicId);

    if (cloudinaryResponse.result !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Failed to delete image from Cloudinary",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
