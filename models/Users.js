const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      min: 3,
    },
    username: {
      type: String,
      required: true,
      max: 20,
      min: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    telephoneNumber: {
      type: String,
      minlength: 10,
      // required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    joinedGroups: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
