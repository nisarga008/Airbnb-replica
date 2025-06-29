const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users")
const passport=require("passport");




router.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync(userController.signUpUser))

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
}), userController.loginUser);

router.get("/logout",userController.logoutUser)

module.exports = router;
