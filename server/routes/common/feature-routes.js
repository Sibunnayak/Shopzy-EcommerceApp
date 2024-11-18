const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteImageController,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.post("/delete", deleteImageController);

module.exports = router;
