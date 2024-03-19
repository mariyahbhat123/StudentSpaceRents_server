const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
let jwtSecret = "MYNameniiIjauihiuae";

router.post(
  "/users",
  [
    body("email").isEmail(),
    body("name").isLength({ max: 10 }),
    body("password").isLength({ max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    try {
      const { email, password, name, gender, img } = req.body;

      if (!email || !password || !name || !gender) {
        return res.status(400).json({ msg: "Please enter all the fields" });
      }

      const existingEmail = await userModel.findOne({ email });

      if (existingEmail) {
        return res
          .status(400)
          .json({ msg: "User with the same email already exists" });
      }

      await userModel
        .create({
          name: req.body.name,
          email: req.body.email,
          gender: req.body.gender,
          password: pwd,
        })
        .then(req.json({ success: true }));
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
