const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },

    gender: String,
    img: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
    },
    password: { type: String, require: true },
    confirmPassword: { type: String, require: true },
    Date: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "users" }
);

const userModel = model("userModel", userSchema);
module.exports = userModel;
