const express = require('express');
const {verifyToken} = require('../middlewares/tokenVerification');
const {getAllCourses, addCourse, deleteCourse} = require('../controllers/course.controller');
const {getAllAssignments, addAssignment, getEditPage, editAssignment, deleteAssignment} = require("../controllers/assignment.controller");
const {validateCourse, validateAssignment} = require("../middlewares/validation");
const router = express.Router();



//Get all the courses a user has.
router.get("/", verifyToken, getAllCourses);

//Get a specific course for a user. Using a query param here.
router.get("/assignments", verifyToken, getAllAssignments);

//Add an assignment to a specific course
router.post("/assignments/add",verifyToken, addAssignment);

//Gets the edit page for a specific assignment
router.get("/assignments/edit/:id",verifyToken, getEditPage);

//Edits a specific assignment
router.post("/assignments/edit/:id",verifyToken, validateAssignment, editAssignment);

//Removes a specific assignment
router.delete("/assignments/remove/:id",verifyToken, deleteAssignment);

//Removes a course and all its attached assignments
router.delete("/remove/:id",verifyToken,deleteCourse);

//Add a course for a user.
router.post("/add", verifyToken,addCourse);



module.exports = router;