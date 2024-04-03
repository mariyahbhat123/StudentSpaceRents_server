const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const propertyDetail = require("../Models/propertyDetailsModel");
const ownerModel = require("../Models/ownerModel");

router.post(
  "/addProperty",
  [
    body("ownerEmail").isEmail(),
    body("ownerName").isLength({ max: 10 }),
    body("coordinates").isLatLong(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const {
        img0,
        img1,
        img2,
        img3,
        ownerEmail,
        ownerName,
        propertyType,
        landmark,
        district,
        address,
        monthlyRent,
        amenities,
        foodIncluded,
        coordinates,
        description,
      } = req.body;
      const email = await ownerModel.findOne({ email });

      if (email === ownerEmail) {
        return res.status(200).json({ success: true });
      }
      await propertyDetail.create({
        img0: img0,
        img1: img1,
        img2: img2,
        img3: img3,
        propertyType: propertyType,
        ownerName: ownerName,
        ownerEmail: ownerEmail,
        address: address,
        landmark: landmark,
        district: district,
        monthlyRent: monthlyRent,
        amenities: amenities,
        foodIncluded: foodIncluded,
        coordinates: coordinates,
        description: description,
      });
    } catch (err) {
      return res.status(400).json({ success: false });
      console.log(err);
    }
  }
);

module.exports = router;
