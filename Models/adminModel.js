const mongoose = require("mongoose");
const { collection } = require("./ownerModel");
const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { collection: "admin" }
);

const adminModel = model("adminModel", adminSchema);
module.exports = adminModel;
