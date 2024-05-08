const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const localitiesSchema = new Schema(
  {
    district: String,
    localities: Array,
  },
  { collection: "localities" }
);

const localitiesModel = model("localitiesModel", localitiesSchema);
module.exports = localitiesModel;
