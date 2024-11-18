const Feature = require("../../models/Feature");
const { imageDeleteUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const deleteImageController = async (req, res) => {
  try {
    const { imageUrl, type } = req.body;
    // console.log(req.body, "req.body");
    // Extract the public ID from the image URL
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extracts the string between the last "/" and ".jpg"
    // console.log(publicId, "publicId");

    // Delete the image from Cloudinary
    const cloudinaryResponse = await imageDeleteUtil(publicId);

    if (cloudinaryResponse.result !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Failed to delete image from Cloudinary",
      });
    }

    // Handle deletion based on type
    if (type === "featured") {
      // Delete the entire document if it's a featured image
      const deleteResult = await Feature.deleteOne({ image: imageUrl });
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Feature image not found in database",
        });
      }
    } else if (type === "product") {
      // Set the image field to null for a product
      const updateResult = await Product.updateOne(
        { images: imageUrl },
        { $pull: { images: imageUrl } }
      );
      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Product image not found in database",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      deletedImageUrl: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the image",
    });
  }
};

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // console.log(image, "image");

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteImageController };
