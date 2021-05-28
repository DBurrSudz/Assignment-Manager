const jwt = require("jsonwebtoken");

const flash = require("connect-flash");
/**
 * Middleware to verify token for each request.
 * @param {*} req The request object from the client.
 * @param {*} res The response object from the server.
 * @param {*} next The next function in line.
 */
const verifyToken = (req,res,next) => {
    if(!req.session.token) {
        req.flash("flash",[{alert_type: "alert-danger",content: ["Not Logged In!"]}]);
        res.redirect("/");
    }
    else{
        const token = req.session.token;
        jwt.verify(token,process.env.TOKEN_KEY, (err, authorizedUserPayload) => {
            if(err) res.status(403).send("Unauthorized.");
            else{
                req.session.currentUser = authorizedUserPayload;
                next();
            }
        })
    }
}

module.exports = {
    verifyToken
}