const mongoose = require("mongoose");
const uri = "mongodb://0.0.0.0:27017/";

const db = () => {
  try {
    mongoose.connect(uri, { dbName: "studentSpaceRents" });
    console.log("CONNECTED");
  } catch (error) {
    console.log(error);
  }
};
module.exports = db;
