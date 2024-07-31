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
      console.log("BODY", req.body);
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

      res.status(300).json({
        success: true,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        msg: false,
        error: err,
      });
    }
  }
);

router.post("/propertyData", async (req, res) => {
  try {
    const propertyData = await propertyDetail.find({});
    res.send(propertyData);
    console.log(propertyData);
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

router.post("/propertyData/:propertyID", async (req, res) => {
  try {
    const propertyId = req.params.propertyID;
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

router.delete("/deleteProperty/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const propertyDelete = await propertyDetail.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true });
  } catch (err) {
    res.send({ success: false, message: "Deleted Successfully" });
  }
});

//Admin Updated Properties
router.put("/editProperties/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const updated = {
      district: req.body.district,
      propertyType: req.body.propertyType,
      address: req.body.address,
    };

    console.log(updated.address);
    await propertyDetail.findByIdAndUpdate(id, {
      district: updated.district,
      address: updated.address,
      propertyType: updated.propertyType,
    });

    res.send({ success: true });
  } catch (error) {
    return (
      console.log(error), res.json({ msg: "Couldnt edit property", err: error })
    );
  }
});

router.post("/ownerPropertyList/:ownerEmail", async (req, res) => {
  try {
    const email = req.params.ownerEmail;
    const ownerProperty = await propertyDetail.find({ ownerEmail: email });
    return res.status(200).json({
      success: true,
      ownerProperty: ownerProperty,
    });
  } catch (err) {
    res.send({ success: false });
  }
});

router.post("/propertyDataFilter/:propertyTypes/:fors", async (req, res) => {
  try {
    const propertyType = req.params.propertyTypes;
    const fors = req.params.fors;

    const filtered = await propertyDetail.find({
      propertyType: propertyType,
      for: fors,
    });
    console.log(filtered);
    return res.status(200).json({ success: true, filtered: filtered });
  } catch (err) {
    res.send({ success: false });
  }
});
module.exports = router;
