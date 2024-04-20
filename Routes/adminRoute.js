const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../Models/adminModel");
const jwtSecretAdmin = "HELLOMYNAMEWISHEYYDH";

router.post("/loginAdmin", async (req, res) => {
  let email = req.body.email;
  console.log(email);

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const adminData = await adminModel.findOne({ email });
    console.log(adminData);
    if (!adminData) {
      return res
        .status(400)
        .json({ error: "Try logging with correct credentials" });
    }

    if (req.body.password != adminData.password) {
      return res
        .status(400)
        .json({ error: "Try logging with correct credentials" });
    } else {
      const data = {
        admin: {
          id: adminData._id,
          name: adminData.name,
          email: adminData.email,
        },
      };
      const adminAuthToken = jwt.sign(data, jwtSecretAdmin);
      const adminDetail = {
        name: adminData.name,
        email: adminData.email,
      };
      return res.json({ success: true, adminAuthToken, adminDetail });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.post("/adminAuthApi", async (req, res) => {
  let token = req.body.token;

  if (token) {
    const decode = jwt.verify(token, jwtSecretAdmin);

    res.json({ login: true, data: decode });
  } else {
    res.json({ login: false, data: "error" });
  }
});

module.exports = router;
