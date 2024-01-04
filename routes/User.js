const router = require("express").Router();
const authUser = require("../middlewares/middle.js")
const {
  // getAdmin,
  adminPost,
  getAdminCount,
  adminRegister,
  changePassword,
} = require("../controllers/User.js");

// router.get("/", getAdmin);
router.get("/get-admin-count", getAdminCount);
router.post("/", adminPost);
router.post("/register", adminRegister);
router.post("/changePassword",authUser, changePassword);

module.exports = router;
