const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertyDetailsModel = new Schema(
  {
    img: { type: String, require: true },
    img1: { type: String },
    img2: { type: String },
    img3: { type: String },
    propertyType: { type: String, require: true },
    ownerName: { type: String, require: true },
    ownerEmail: { type: String, require: true },
    address: { type: String, require: true },
    landmark: { type: String },
    district: { type: String, require: true },
    monthlyRent: { type: Number, require: true },
    description: { type: String },
    Date: { type: Date, default: Date.now() },
  },
  { collection: "propertyDetails" }
);

const propertyDetail = model("propertyDetail", propertyDetailsModel);
module.exports = propertyDetail;
