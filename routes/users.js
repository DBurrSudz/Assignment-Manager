const express = require('express');
const {registerUser,loginUser, logoutUser} = require('../controllers/user.controller');
const {validateRegistration} = require('../middlewares/validation');
const {verifyToken} = require("../middlewares/tokenVerification");
const router = express.Router();

//Register a user
router.post("/register", validateRegistration, registerUser);

//Authenticating a user
router.post("/login", loginUser);

//Logs out a user
router.post("/logout", verifyToken, logoutUser);


module.exports = router;
