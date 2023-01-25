const mongoose = require("mongoose");

const groupsSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      min: 3,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", groupsSchema);
