const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirecturl } = require("../utils/middelwares");
const userController = require("../controller/user"); 




router.get("/signup", userController.signupPage );

router.post( "/signup", wrapAsync(userController.signup));

router.get("/login", userController.loginPage);

router.post("/login",saveRedirecturl, passport.authenticate("local", { 

    failureFlash: true,
    failureRedirect: "/login",
  
})
, (req, res) => {
    req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
}
);
router.get("/logout", userController.logout);
module.exports = router;
