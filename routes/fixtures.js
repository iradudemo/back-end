const {
  getFixtures,
  createFixtures,
  updateFixtures,
  deleteFixtures,
  getSingleFixtures,
} = require("../controllers/fixtures");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.route("/").get(getFixtures).post(auth, createFixtures);
router
  .route("/:id")
  .put(auth, updateFixtures)
  .delete(auth, deleteFixtures)
  .get(getSingleFixtures);
module.exports = router;
