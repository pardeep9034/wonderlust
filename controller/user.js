const User = require("../models/users");

module.exports.signupPage=(req, res) => {
    res.render("./user/signup");
  }
  module.exports.signup=async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
          if (err){return next(err);}
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
      });
      
    } catch (e) {
      console.log(e);
        req.flash("error", e.message);
      res.redirect("/signup");
    }
  }
    module.exports.loginPage=(req, res) => {
        res.render("./user/login");
    }

    module.exports.logout=(req, res,next) => {
        req.logout((err) => {
            if(err){return next(err);}
          req.flash("success", "Goodbye!");
          res.redirect("/listings")
        }
        );
        }