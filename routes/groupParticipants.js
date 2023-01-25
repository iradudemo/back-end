const User = require("../models/Users");
const Groups = require("../models/groups");
const GroupsParticipants = require("../models/groupParticipants");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const ErrorResponse = require("../helpers/errorResponse");

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/join", async (req, res, next) => {
  const { userId, groupId } = req.body;
  if (userId == "" || groupId == "") {
    return next(
      new ErrorResponse("please provide user and specify the group", 400)
    );
  }
  try {
    const newPart = GroupsParticipants.create({ userId, groupId });

    res.status(201).json({ msg: "Joined", data: newPart });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});

module.exports = router;
