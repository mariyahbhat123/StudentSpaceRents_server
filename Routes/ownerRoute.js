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
    if (!errors.isEmpty()) {
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
        return res.status(400).json({
          msg: "User with the same email already exists",
          error: "emailExist",
        });
      }
      if (existingNumber) {
        return res
          .status(400)
          .json({ msg: "Number already exists", error: "number" });
      }
      if (password != confirmPassword) {
        return res.status(400).json({
          msg: "Password and confirm password should match",
          error: "password",
        });
      }
      await ownerModel.create({
        name: username,
        email: email,
        number: number,
        password: pwd,
        confirmPassword: cpwd,
      });
      const ownerAuthToken = jwt.sign({ ownerModel }, jwtSecret);
      res.status(200).send({ success: true, ownerAuthToken });
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

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const ownerData = await ownerModel.findOne({ email });
      if (!ownerData) {
        return res
          .status(400)
          .json({ msg: "Please enter correct credentials", error: "email" });
      }

      const pwdCompare = await bcrypt.compare(
        req.body.password,
        ownerData.password
      );

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ msg: "Enter correct credentials", error: "password" });
      } else {
        const data = {
          id: ownerData._id,
          name: ownerData.name,
          email: ownerData.email,
          number: ownerData.number,
        };

        const ownerDetail = {
          name: ownerData.name,
          email: ownerData.email,
          img: ownerData.img,
        };
        const ownerAuthToken = jwt.sign(data, jwtSecretOwner);
        return res.json({ success: true, ownerAuthToken, ownerDetail });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

router.post("/ownersLength", async (req, res) => {
  try {
    const ownerData = await ownerModel.find({});
    return res.status(200).json({ success: true, ownerData: ownerData });
  } catch (err) {
    return res.send({ success: false });
  }
});

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
