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
router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params["id"];
    if (id === "all") {
      const gg = await Groups.find();
      res.status(200).json({ msg: "fetched groups", data: gg });
    } else {
      const group = await Groups.findOne({
        _id: req.params["id"],
      });
      return res.status(200).json({ group });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  const { groupName, description, target } = req.body;
  if (groupName == "" || description == "") {
    return next(
      new ErrorResponse("group name and description is required", 400)
    );
  }
  const newgroup = await Groups.create({ groupName, description, target });
  const newPart = await GroupsParticipants.create({
    userId: req.user._id,
    groupId: newgroup._id,
  });

  res.status(201).json({ msg: "group created", data: newgroup });
});
router.delete("/:groupId", auth, async (req, res, next) => {
  const group = await Groups.findByIdAndDelete(req.params.groupId);
  if (!group) {
    return next(
      new ErrorResponse(
        `Group with an id: ${req.params.groupId} not found`,
        404
      )
    );
  }

  group.remove();
  res.status(200).json({
    success: true,
    msg: `A group with id of ${req.params.groupId} is successfully deleted`,
  });
});
router.put("/:groupId", async (req, res, next) => {
  const group = await Groups.findByIdAndUpdate(req.params.groupId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!group) {
    return next(
      new ErrorResponse(`group with an id: ${req.params.taskId} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: `A group with id of ${req.params.taskId} is Successfully updated`,
    group,
  });
});
module.exports = router;
