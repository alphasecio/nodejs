const { Router } = require("express");
const {
  handleGetUserSignin,
  handleGetUserSignup,
  handlePostUserSignin,
  handlePostUserSignup,
  handleUserLogout,
} = require("../controllers/user");

const router = Router();

router.get("/signin", handleGetUserSignin);
router.post("/signin", handlePostUserSignin);
router.get("/signup", handleGetUserSignup);
router.post("/signup", handlePostUserSignup);
router.get("/logout", handleUserLogout);

module.exports = router;
