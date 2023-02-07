const mongoose = require("mongoose");

const FixtureSchema = new mongoose.Schema(
  {
    home: {
      type: String,
      required: [true, "Provide Home team"],
    },
    away: {
      type: String,
      required: [true, "Provide Away team"],
    },
    stadium: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: [true, "Provide Time of Match"],
    },
    date: {
      type: Date,
      required: [true, "Provide Date"],
    },
    isMatchEnded: {
      type: Boolean,
      default: false,
    },
    homeResult: {
      type: Number,
    },
    awayResult: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fixture", FixtureSchema);
