const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const auth = require("../middleware/auth");

// register
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const newUser = await User.create({
      fullName: req.body.fullName,
      telephoneNumber: req.body.telephoneNumber,
      gender: req.body.gender,
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      password: hashedPassword,
    });

    res.status(200).json({ user: newUser });
  })
);

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        telephone: user.telephoneNumber,
        gender: user.gender,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5d",
      }
    );

    // user
    return res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      telephone: user.telephoneNumber,
      gender: user.gender,
      address: user.address,
      role: user.role,
      token,
      username: user.username,
      coverPicture: user.coverPicture,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      joinedGroups: user.joinedGroups,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
});

router.put(
  "/userDetaails/:id",
  auth,
  asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      telephoneNumber: req.body.telephoneNumber,
      gender: req.body.gender,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    console.log("req.user", req.user);

    res.status(200).json({
      message: "success",
      data: user,
    });
  })
);

router.put(
  "/:userId",
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  })
);

module.exports = router;
