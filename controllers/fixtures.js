const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const Fixture = require("../models/Fixtures");

exports.getFixtures = asyncHandler(async (req, res, next) => {
  const fixtures = await Fixture.find();
  if (fixtures.length < 0) {
    return next(new ErrorResponse("No fixtures made", 204));
  }
  res.status(200).json({ msg: "Fetched fixtures", data: fixtures });
});
exports.createFixtures = asyncHandler(async (req, res, next) => {
  const { home, away, stadium, time, date } = req.body;
  if (home == "" || away == "" || time == "" || Date == "" || stadium == "") {
    return next(new ErrorResponse("Please fill all required field", 422));
  }
  const fixtures = await Fixture.create({
    home,
    away,
    time,
    date,
    stadium,
  });

  res.status(201).json({ msg: "success", data: fixtures });
});

exports.getSingleFixtures = asyncHandler(async (req, res, next) => {
  const fixtures = await Fixture.findById(req.params.id);
  if (!fixtures) {
    return next(
      new ErrorResponse(`Fixtures with an id: ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ msg: "retrived fixtures", data: fixtures });
});

exports.updateFixtures = asyncHandler(async (req, res, next) => {
  const fixtures = await Fixture.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!fixtures) {
    return next(
      new ErrorResponse(`Fixture with an id: ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: `update a fixtures with id of ${req.params.taskId} is Successfully updated`,
    fixtures,
  });
});

exports.deleteFixtures = asyncHandler(async (req, res, next) => {
  const fixtures = await Fixture.findByIdAndDelete(req.params.id);
  if (!fixtures) {
    return next(
      new ErrorResponse(`Fixture with an id: ${req.params.id} not found`, 404)
    );
  }

  fixtures.remove();
  res.status(200).json({
    success: true,
    msg: `A fixtures with id of ${req.params.id} is successfully deleted`,
  });
});
