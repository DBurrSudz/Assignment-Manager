const User = require('../models/User');
const Course = require("../models/Course");

/**
 * Get all the courses for a user.
 * @param {Object} req 
 * @param {Object} res 
 */
const getAllCourses = (req,res) => {
    const currentUserID = req.session.currentUser.user.id;
    User.findOne({_id: currentUserID})
        .populate("courses")
        .exec((err, foundUser) => {
            if(err) return;
            else{
                const flash = req.flash("flash")[0];
                if(foundUser.courses.length > 0) {
                    if(flash) res.render("courses",{title: "Home",courses: foundUser.courses,flash});
                    else res.render("courses",{title: "Home",courses: foundUser.courses});
                }
                else{
                    res.render("courses",{title: "Home"});
                }
            }
        });
}

/**
 * Add a course for a user.
 * @param {Object} req 
 * @param {Object} res 
 */
const addCourse = (req,res) => {
    req.body.student = req.session.currentUser.user.id;
    Course.create(req.body, (err,course) => {
        if(err) return;
        else{
            course.save()
            .then(savedDocument => {
                User.findByIdAndUpdate(req.body.student, {$push: {courses: savedDocument._id}}, {new: true, useFindAndModify: false}, (err, updatedDocument) => {
                    if(err) return;
                    else{
                        req.flash("flash",[{alert_type: "alert-success",content:["Successfully Added Course!"]}])
                        res.redirect("/courses");
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    });
}

/**
 * Deletes a course for a user.
 * @param {Object} req 
 * @param {Object} res 
 */
const deleteCourse = (req,res) => {
    const courseID = req.params.id;
    const currentUserID = req.session.currentUser.user.id
    Course.deleteOne({_id: courseID}, err => {
        if(err) res.status(500).send("Error");
        else {
            User.findByIdAndUpdate(currentUserID, {$pull: {courses: courseID}}, {new: true, useFindAndModify: false}, (err,updatedDocument) => {
                if(err) res.status().send("Sever Error.");
                else{
                    req.flash("flash",[{alert_type: "alert-success",content: ["Successfully Removed Course!"]}])
                    res.status(200).send();
                }
            });
        }
    });
}

module.exports = {
    getAllCourses,
    addCourse,
    deleteCourse
}