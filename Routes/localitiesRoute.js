const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const localitiesModel = require("../Models/localitiesModel");

router.get("/localities/:district", async (req, res) => {
  try {
    let district = req.params.district;
    const locality = await localitiesModel.findOne({ district });
    console.log(locality);
    return res.status(200).json({
      success: true,
      localities: locality,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;
