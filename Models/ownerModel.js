const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ownerSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      require: true,
      unique: true,
    },
    number: Number,
    img: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
    },
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true },
    Date: { type: Date, default: Date.now() },
  },
  { collection: "owners" }
);

const ownerModel = model("ownerModel", ownerSchema);
module.exports = ownerModel;
