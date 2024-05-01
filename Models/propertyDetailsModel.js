const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// const amenities = new Schema({
//   heatingAndCoolingSystem: { type: Boolean },
//   storageSpace: { type: Boolean },
//   internetAndCableServices: { type: Boolean },
//   Furnished: { type: Boolean },
// });

// const foodIncluded = new Schema({
//   breakfast: { type: Boolean },
//   lunch: { type: Boolean },
//   dinner: { type: Boolean },
// });
const propertyDetailsModel = new Schema(
  {
    img0: { type: String, require: true },
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
    amenities: {
      heatingAndCoolingSystem: { type: Boolean },
      storageSpace: { type: Boolean },
      internetAndCableServices: { type: Boolean },
      Furnished: { type: Boolean },
    },
    foodIncluded: {
      breakfast: { type: Boolean },
      lunch: { type: Boolean },
      dinner: { type: Boolean },
    },
    coordinates: {
      lat: { type: Number, require: true },
      lng: { type: Number, require: true },
    },
    for: { type: String, require: true },
    description: { type: String },
    Date: { type: Date, default: Date.now() },
  },
  { collection: "propertyDetails" }
);

const propertyDetail = model("propertyDetail", propertyDetailsModel);
module.exports = propertyDetail;
