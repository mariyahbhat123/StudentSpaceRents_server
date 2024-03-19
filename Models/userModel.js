const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    img: String,
    gender: String,
    password: { type: String, require: true },
  },
  { collection: "users" }
);

const userModel = model("userModel", userSchema);
module.exports = userModel;
