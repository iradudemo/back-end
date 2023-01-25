const User = require("../models/Users");
const Groups = require("../models/groups");
const GroupsParticipants = require("../models/groupParticipants");
const router = require("express").Router();
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../helpers/errorResponse");
// get a user
router.get("/", auth, async (req, res) => {
  try {
    const groups = [];
    const groupsCurrentUser = await GroupsParticipants.find({
      userId: req.user._id,
    });
    for (let i = 0; i < groupsCurrentUser.length; i++) {
      const groupDetails = await Groups.findOne({
        _id: groupsCurrentUser[i].groupId,
      });
      groups.push({ ...groupsCurrentUser[i]._doc, groupDetails });
    }
    return res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/all", auth, async (req, res) => {
  try {
    const gg = await Groups.find();
    res.status(200).json({ msg: "fetched groups", data: gg });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  const { groupName, description } = req.body;
  if (groupName == "" || description == "") {
    return next(
      new ErrorResponse("group name and description is required", 400)
    );
  }
  const newgroup = Groups.create({ groupName, description });
  res.status(201).json({ msg: "group created", data: newgroup });
});

module.exports = router;
