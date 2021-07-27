const User = require('../models/User');
const { hashInformation } = require('../helpers/hashHelper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const flash = require("connect-flash");


/**
 * Controller function to register a user in the system.
 * @param {Object} req The request object sent by the client.
 * @param {Object} res The response object from the server.
 */
const registerUser = async (req, res) => {
    const foundDocument = await User.findOne({ username: req.body.username });
    if (foundDocument) {
        req.flash("registration_errors", [{ username: "Username is already taken." }]);
        res.redirect("/registration");
    }
    else {
        const foundEmail = await User.findOne({ email: req.body.email });
        if (foundEmail) {
            req.flash("registration_errors", [{ email: "Email is already taken." }]);
            res.redirect("/registration");
        }
        else {
            req.body.password = await hashInformation(req.body.password);
            delete req.body.confirm_password;
            User.create(req.body, (err, createdUser) => {
                if (err) return;
                createdUser.save().then(savedUser => {
                    req.flash("flash", [{ alert_type: "alert-success", content: ["Successfully Registered!"] }]);
                    res.redirect("/");
                }).catch(err => {
                    res.status(404).send(`Some error occurred on the server while attempting registration.`);
                });
            })
        }
    }
}



/**
 * Controller function to authenticate a user of the system.
 * @param {*} req The request object sent by the client.
 * @param {*} res The response object from the server.
 */
const loginUser = (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (err) res.send("Error occurred on the server.");//res.render("error",{loginError: "Server Error."});

        else {
            if (!foundUser) {
                req.flash("flash", [{ alert_type: "alert-warning", content: ["Invalid Credentials."] }]);
                res.redirect("/");
            }
            else {
                bcrypt.compare(req.body.password, foundUser.password)
                    .then(isValid => {
                        if (isValid) {
                            const token = jwt.sign({ user: { id: foundUser._id } }, process.env.TOKEN_KEY, { expiresIn: "2h" });
                            req.session.token = token;
                            res.redirect("/courses");
                        }
                        else {
                            req.flash("flash", [{ alert_type: "alert-warning", content: ["Invalid Credentials."] }]);
                            res.redirect("/");
                        }

                    })
                    .catch(err => {
                        res.send("Error hero occurred on the server.");
                    })
            }
        }
    });
}


/**
 * Logs out a user from the system by destroying their session and redirecting them to the welcome page.
 * @param {*} req 
 * @param {*} res 
 */
const logoutUser = (req, res) => {
    req.session.destroy();
    res.status(200).send();
}


const getProfilePage = async (req, res) => {
    const currentUserID = req.session.currentUser.user.id;
    const currentUser = await User.findById(currentUserID);
    res.render("profile", { title: "Profile", user: currentUser });
}


const editProfile = (req, res) => {
    const currentUserID = req.session.currentUser.user.id;
    const updateParams = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    }

    User.findByIdAndUpdate(currentUserID, updateParams, { new: true, useFindAndModify: false }, (err, updatedDocument) => {
        if (err) return;
        res.redirect("/profile");
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfilePage,
    editProfile
}