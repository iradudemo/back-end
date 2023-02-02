const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      max: 300,
      unique: true,
    },
    desc: {
      type: String,
      max: 1500,
    },
    image: {
      type: String,
    },
    type: String,
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostSchema);
