var express = require('express');
const flash = require("connect-flash");
var router = express.Router();

//Gets the login page
router.get('/', function(req, res, next) {
  const flash = req.flash("flash")[0];
  if(flash) res.render('welcome',{title:"Welcome",flash});
  else res.render('welcome', {title: 'Welcome'});
  
});

//Gets the registration page
router.get('/registration',function(req,res,next) {
  const registration_errors = req.flash("registration_errors")[0];
  if(registration_errors) res.render('registration',{title:"Sign Up!",registration_errors});
  else res.render('registration', {title: 'Sign Up!', registration_errors: {}});
  
});

module.exports = router;