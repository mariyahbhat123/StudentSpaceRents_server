const express = require("express");
const router = express.Router();

const multer = require("multer");
const { body, validationResult } = require("express-validator");
const propertyDetail = require("../Models/propertyDetailsModel");

const storage = multer.diskStorage({
  destination: function (rq, file, cb) {
    cb(null, "../images");
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });

router.post(
  "/addProperty",

  upload.fields([
    { name: "img0", maxCount: 1 },
    { name: "img1" },
    { name: "img2" },
    { name: "img3" },
  ]),
  [(body("ownerEmail").isEmail(), body("ownerName").isLength({ max: 10 }))],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const {
        ownerEmail,
        ownerName,
        propertyType,
        landmark,
        district,
        address,
        monthlyRent,
        heatingAndCoolingSystem,
        Furnished,
        storageSpace,
        internetAndCableServices,
        description,
        breakfast,
        lunch,
        dinner,
        lat,
        lng,
        forGender,
      } = req.body;
      const { img0, img1, img2, img3 } = req.files;
      console.log(img0[0]);

      await propertyDetail.create({
        img0: img0[0].filename,
        img1: img1[0].filename,
        img2: img2[0].filename,
        img3: img3[0].filename,
        propertyType: propertyType,
        ownerName: ownerName,
        ownerEmail: ownerEmail,
        address: address,
        landmark: landmark,
        district: district,
        monthlyRent: monthlyRent,
        amenities: {
          heatingAndCoolingSystem: heatingAndCoolingSystem,
          storageSpace: storageSpace,
          internetAndCableServices: internetAndCableServices,
          Furnished: Furnished,
        },
        foodIncluded: {
          breakfast: breakfast,
          lunch: lunch,
          dinner: dinner,
        },
        coordinates: {
          lat: lat,
          lng: lng,
        },
        description: description,
        for: forGender,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        msg: false,
      });
    }
  }
);

router.post("/propertyData", (req, res) => {
  try {
    res.send(propertyDetails);
    console.log(propertyDetails);
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

router.post("/propertyData/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const propertyData = await propertyDetail.findById({ _id: propertyId });

    return res.status(200).json({
      success: true,
      propertyData: propertyData,
    });
  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
});
module.exports = router;
