const { verifyToken } = require('../middlewares/tokenVerification');
const router = require('express').Router();
const {getProfilePage, editProfile} = require("../controllers/user.controller");


//Gets the profile page
router.get('/',verifyToken,getProfilePage);

//Edits the user information
router.post('/edit/:id',verifyToken,editProfile);






module.exports = router