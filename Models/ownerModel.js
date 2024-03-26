const mongoose = require("mongoose");
const { collection } = require("./userModel");
const { Schema, model } = mongoose;

const ownerSchema = Schema(
  {
    name: String,
    email: {
      type: String,
      require: true,
      unique: true,
    },
    number: Number,
    img: { type: String },
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true },
    Date: { type: Date, default: Date.now() },
  },
  { collection: "owners" }
);

const ownerModel = model("ownerModel", ownerSchema);
module.exports = ownerModel;
