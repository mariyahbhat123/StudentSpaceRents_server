const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ownerModel = require("../Models/ownerModel");
const jwtSecretOwner = "HELLOMYNAMEWISHEYYDH";

router.post(
  "/owners",
  [
    body("email").isEmail(),
    body("username").isLength({ max: 10 }),
    body("number").isLength({ max: 10 }),
    body("password").isLength({ max: 10 }),
    body("confirmPassword").isLength({ max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ error: errors.array() });
    }

    //SALTING
    const salt = await bcrypt.genSalt();
    const pwd = await bcrypt.hash(req.body.password, salt);
    const cpwd = await bcrypt.hash(req.body.confirmPassword, salt);

    try {
      const { username, email, number, password, confirmPassword } = req.body;

      if (!username || !email || !number || !password || !confirmPassword) {
        return res.status(400).json({ msg: "Please enter all the fields" });
      }

      const existingEmail = await ownerModel.findOne({ email });
      const existingNumber = await ownerModel.findOne({ number });

      if (existingEmail) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      if (existingNumber) {
        return res.status(400).json({ msg: "Number already exists" });
      }
      if (password != confirmPassword) {
        return res.status(400).json({ msg: "Passwords do no match" });
      }
      await ownerModel
        .create({
          name: username,
          email: email,
          number: number,
          password: pwd,
          confirmPassword: cpwd,
        })
        .then(res.json({ success: true }));
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }
);

router.post(
  "/ownerLogin",
  [body("email").isEmail(), body("password").isLength({ max: 10 })],
  async (req, res) => {
    const email = req.body.email;

    const errors = validationResult(req);

    if (!errors) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const ownerData = await ownerModel.findOne({ email });
      if (!ownerData) {
        return res
          .status(400)
          .json({ error: "Please enter correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(
        req.body.password,
        ownerData.password
      );

      if (!pwdCompare) {
        return res.status(400).json({ error: "Enter correct credentials" });
      } else {
        const data = {
          id: ownerData._id,
          name: ownerData.name,
          email: ownerData.email,
          number: ownerData.number,
        };
        const ownerAuthToken = jwt.sign(data, jwtSecretOwner);
        return res.json({ success: true, ownerAuthToken, ownerData });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

router.post("/ownerAuthApi", async (req, res) => {
  let token = req.body.token;

  if (token) {
    const decode = jwt.verify(token, jwtSecretOwner);

    res.json({ login: true, data: decode });
  } else {
    res.json({ login: false, data: "error" });
  }
});
module.exports = router;
