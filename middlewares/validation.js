const joi = require('joi');
const joiToForms = require('joi-errors-for-forms').form;
const flash = require("connect-flash");
const passwordRegx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
const convertToForms = joiToForms();

/**
 * Middleware to validate registration credentials submitted by client.
 * @param {*} req The request object from the client.
 * @param {*} res The response object from the server.
 * @param {*} next The next function in line.
 */
const validateRegistration = (req,res,next) => {
    const registrationSchema = joi.object({
        username: joi.string().trim().min(4).required().messages({
            "string.empty": "Username is a required field.",
            "string.min": "Username must be at least 4 characters long.",
            "string.trim": "Whitespace not allowed.",
            "any.required": "Username is a required field."
        }),
        name: joi.string().trim().required().messages({
            "string.base": "Name should be a textual value.",
            "string.empty": "Name is a required field.",
            "string.trim": "Whitespace not allowed.",
            "any.required": 'Name is a required field.'
        }),
        email: joi.string().trim().required().email().messages({
            "string.email": "Please enter a valid email address.",
            "string.empty": "Email Address is a required field.",
            "string.base": "Email Address should be a textual value",
            "string.trim": "Whitespace not allowed.",
            "any.required": "Email Address is a required field."
        }),
        password: joi.string().trim().pattern(passwordRegx).min(6).required().messages({
            "string.empty": "Password is a required field.",
            "string.base" : "Password must be a textual value.",
            "any.required": "Password is a required field.",
            "string.min": "Password must exceed 6 characters.",
            "string.trim": "Whitespace not allowed.",
            "string.pattern.base": "Password must contain at least one special character, one digit, one lowercase and one uppercase letter."
        }),
        confirm_password: joi.string().trim().required().valid(joi.ref('password')).messages({
            "any.only": "Password and Confirm Password must be the same.",
            "string.trim": "Whitespace not allowed."
        })
    });

    const {error} = registrationSchema.validate(req.body, {abortEarly: false});
    if(error) {
        req.flash("registration_errors",[convertToForms(error)]);
        res.redirect("/registration");
    }
    else next();
    
}

/**
 * Middleware to validate course credentials submitted by client.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateCourse = (req,res,next) => {
    const courseSchema = joi.object({
        title: joi.string().trim().required(),
        code: joi.string().trim().min(4).messages({
            "string.min": "Course Code must be at least 4 characters long."
        }),
        description: joi.string().trim(),
    });

    const {error} = courseSchema.validate(req.body, {abortEarly: false});
    if(error) {
        res.send(error.details);
    }
    else {
        next();
    }
}

const validateAssignment = (req,res,next) => {
    const assignmentSchema = joi.object({
        title: joi.string().trim().required().messages({
            "any.required": "Title is a required field."
        }),
        topic: joi.string().trim().required().messages({
            "any.required": "Topic is a required field."
        }),
        description: joi.string().optional(),
        assignedDate: joi.date().required().messages({
            "any.required": "Assigned Date is a required field.",
            "date.base": "Date is not valid."
        }),
        dueDate: joi.date().greater(joi.ref("assignedDate")).required().messages({
            "any.required": "Due Date is a required field.",
            "date.base": "Date is not valid.",
            "date.greater": "Due Date must be greater than Assigned Date."
        })
    });

    const {error} = assignmentSchema.validate(req.body,{abortEarly: false});
    if(error) {
        req.flash("assignment_errors",[convertToForms(error)]);
        res.redirect("/courses/assignments/edit/"+ req.params.id);
    }
    else {
        next();
    }
}


module.exports.validateRegistration = validateRegistration;
module.exports.validateCourse = validateCourse;
module.exports.validateAssignment = validateAssignment;