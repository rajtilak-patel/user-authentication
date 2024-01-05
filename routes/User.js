const router = require("express").Router();
const authUser = require("../middlewares/middle.js")
const {
  // getAdmin,
  adminPost,
  getAdminCount,
  adminRegister,
  changePassword,
  getUser,
  sendEmailResetPassword,
  passwordUpdate
} = require("../controllers/User.js");



// router.get("/", getAdmin);
router.get("/get-admin-count", getAdminCount);
router.post("/", adminPost);
router.post("/userDetails", sendEmailResetPassword);
router.post("/passwordUpdate/:token", passwordUpdate);
router.post("/register", adminRegister);
router.post("/changePassword",authUser, changePassword);
router.get("/userDetails",authUser, getUser);

module.exports = router;
