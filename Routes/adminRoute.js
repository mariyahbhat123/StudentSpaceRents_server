const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../Models/adminModel");
const jwtSecretAdmin = "HELLOMYNAMEWISHEYYDH";

const createDefaultAdmin = async () => {
  const adminData = await adminModel.findOne({ email });
  if (adminData.email) {
    return console.log("already a user");
  } else {
    await adminModel.create({
      name: "Mariyah",
      email: "mariyahbhat121@gmail.com",
      password: "helpingAdmin",
    });
  }
};

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
      const authToken = jwt.sign(data, jwtSecretAdmin);
      const adminDetail = {
        name: adminData.name,
        email: adminData.email,
      };
      return res.json({ success: true, authToken, adminDetail });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;
module.exports = createDefaultAdmin;
