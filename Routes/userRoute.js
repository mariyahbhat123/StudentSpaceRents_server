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
    body("confirmPassword").isLength({ max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);
    const cpwd = await bcrypt.hash(req.body.confirmPassword, salt);

    try {
      const { email, password, name, gender, img, confirmPassword } = req.body;

      if (!email || !password || !name || !gender || !confirmPassword) {
        return res.status(400).json({ msg: "Please enter all the fields" });
      }

      const existingEmail = await userModel.findOne({ email });

      if (existingEmail) {
        return res
          .status(400)
          .json({ msg: "User with the same email already exists" });
      }
      if (password != confirmPassword) {
        return res
          .status(400)
          .json(alert("Password and Confirm password should match"));
      }

      await userModel
        .create({
          name: req.body.name,
          email: req.body.email,
          gender: req.body.gender,
          password: pwd,
          confirmPassword: cpwd,
        })
        .then(res.json({ success: true }));
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

//Login validation

router.post(
  "/loginUsers",
  [body("email").isEmail(), body("password").isLength({ max: 10 })],
  async (req, res) => {
    let email = req.body.email;
    console.log(email);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      let userData = await userModel.findOne({ email });
      console.log(userData);
      if (!userData) {
        return res
          .status(400)
          .json({ error: "Try logging with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ error: "Try logging with correct credentials" });
      } else {
        const data = {
          users: {
            id: userData._id,
            name: userData.name,
            email: userData.email,
          },
        };
        const authToken = jwt.sign(data, jwtSecret);
        const userDetail = {
          name: userData.name,
          email: userData.email,
          gender: userData.gender,
          img: userData.img,
        };
        return res.json({ success: true, authToken, userDetail });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

router.post("/authApi", async (req, res) => {
  let token = req.body.token;

  if (token) {
    const decode = jwt.verify(token, jwtSecret);

    res.json({ login: true, data: decode });
  } else {
    res.json({ login: false, data: "error" });
  }
});

router.post("/usersLength", async (req, res) => {
  try {
    const userData = await userModel.find({});
    return res.status(200).json({ success: true, userData: userData });
  } catch (err) {
    console.log(err);
    return res.send({ success: false });
  }
});

module.exports = router;
