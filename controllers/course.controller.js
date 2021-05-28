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
                if(foundUser.courses.length > 0) {
                    res.render("courses",{title: "Home",courses: foundUser.courses});
                }
                else{
                    res.render("courses",{title: "Home"});
                }
            }
        });
}

// /**
//  * Get a specific course for a user.
//  * @param {Object} req 
//  * @param {Object} res 
//  */
// const getCourse = (req,res) => {
//     const courseID = req.params.courseID;
//     const currentUserID = req.currentUser.user.id;
//     Course.findOne({_id: courseID, student: currentUserID}, (err, foundCourse) => {
//         if(err) res.status(500).send(err);
//         else {
//             if(!foundCourse) {
//                 res.status(404).send("Course was not found.");
//             }
//             else {
//                 res.status(200).send(foundDocument);
//             }
//         }
//     });
// }


// const getCourseNew = (req,res) => {
//     const courseID = req.query.id;
//     const currentUserID = req.currentUser.user.id;
//     Course.findOne({_id: courseID, student: currentUserID})
//         .populate("assignments")
//         .exec((err,course) => {
//             if(err) return;
//             else {
//                 if(course.assignments.length > 0) {
//                     res.status(200).json({assignments: courses.assignments});
//                 }
//                 else {
//                     res.status(200).send("No Assignments to Show.");
//                 }
//             }
//         });
// }



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