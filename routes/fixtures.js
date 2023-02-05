const {
  getFixtures,
  createFixtures,
  updateFixtures,
  deleteFixtures,
  getSingleFixtures,
} = require("../controllers/fixtures");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.route("/").get(auth, getFixtures).post(auth, createFixtures);
router
  .route("/:id")
  .put(auth, updateFixtures)
  .delete(auth, deleteFixtures)
  .get(auth, getSingleFixtures);
module.exports = router;
