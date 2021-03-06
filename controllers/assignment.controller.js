const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const flash = require("connect-flash");


/**
 * Gets all the assignments for a specified course for a user.
 * @param {*} req 
 * @param {*} res 
 */
const getAllAssignments = (req,res) => {
    const currentCourseID = req.query.course_id;
    Course.findOne({_id: currentCourseID})
        .populate("assignments")
        .exec((err,foundCourse) => {
            if(err) return;
            else {
                const flash = req.flash("flash")[0];
                if(foundCourse.assignments.length > 0) {
                    if(flash) res.render("assignment",{title: foundCourse.code + "-" + foundCourse.title, assignments: foundCourse.assignments,link: req.originalUrl,course: currentCourseID,flash});
                    else res.render("assignment",{title: foundCourse.code + "-" + foundCourse.title, assignments: foundCourse.assignments,link: req.originalUrl,course: currentCourseID});
                }
                else {
                    res.render("assignment",{title: foundCourse.code + "-" + foundCourse.title,link: req.originalUrl,course: currentCourseID});
                }
            }
        });
}


const addAssignment = (req,res) => {
    const currentCourseID = req.query.course_id;
    req.body.course = currentCourseID;
    const currentStudentID = req.session.currentUser.user.id;
    const redirectUrl = "//" + req.header('host') + "/courses/assignments?course_id=" + currentCourseID;
    Assignment.create(req.body,(err,createdAssignment) => {
        if(err) return;
        else {
            createdAssignment.save().then(savedDocument => {
                Course.findByIdAndUpdate(currentCourseID,{$push:{assignments: savedDocument._id},$inc: {assignmentCount: 1}}, {new: true, useFindAndModify: false}, (err, updatedDocument) => {
                    if(err) return;
                    else {
                        req.flash("flash",[{alert_type: "alert-success",content: ["Assignment Added Successfully!"]}]);
                        res.redirect(redirectUrl);
                    }
                })
            }).catch(err => {
                console.log(err);
            })
        }
    });
}


const getEditPage = (req,res) => {
    const currentAssignmentID = req.params.id;
    Assignment.findById(currentAssignmentID,(err, foundAssignment) => {
        if(err) return;
        else {
            const assignment_errors = req.flash("assignment_errors")[0];
            if(assignment_errors) res.render("edit_assignment",{title: "Edit Assignment",assignment: foundAssignment,assignment_errors});
            else res.render("edit_assignment",{title: "Edit Assignment", assignment: foundAssignment,assignment_errors: {}});
        }
    })
}


const editAssignment = (req,res) => {
    const currentAssignmentID = req.params.id;

    //User finished assignment
    if(req.body.done) {
        Assignment.findByIdAndUpdate(currentAssignmentID,{finished: true},{new: true,useFindAndModify: false},(err, updatedDocument) => {
            if(err) return;
            else res.json({class: "fa-check"});
        })
    }

    //From edit page
    else {
        const updateParams = {
            title: req.body.title,
            topic: req.body.topic,
            description: req.body.description,
            assignedDate: req.body.assignedDate,
            dueDate: req.body.dueDate
        }
        Assignment.findByIdAndUpdate(currentAssignmentID,updateParams,{new: true,useFindAndModify: false}, async (err, updatedDocument) => {
            if(err) return;
            else {
                let course = await Course.findOne({assignments: {$in: [currentAssignmentID]}});
                let redirectUrl = "//" + req.header('host') + "/courses/assignments?course_id=" + course._id;
                req.flash("flash",[{alert_type: "alert-success",content: ["Changes Made to Assignment Successfully!"]}]);
                res.redirect(redirectUrl);
            }
        })
    }
}


const deleteAssignment = (req,res) => {
    const currentAssignmentID = req.params.id;
    Assignment.deleteOne({_id: currentAssignmentID},err => {
        Course.findOneAndUpdate({assignments: {$in: [currentAssignmentID]}},{$pull: {assignments: currentAssignmentID}, $inc: {assignmentCount: -1}}, {new: true,useFindAndModify: false},(err, updatedDocument) => {
            if(err) return;
            else {
                req.flash("flash",[{alert_type: "alert-success",content: ["Successfully Removed Assignment!"]}]);
                res.status(200).send();
            }
        })
    })
}













module.exports = {
    getAllAssignments,
    addAssignment,
    getEditPage,
    editAssignment,
    deleteAssignment
}