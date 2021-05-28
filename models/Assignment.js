const {Schema, model} = require('mongoose');
const moment = require("moment");
const assignmentSchema = new Schema({
    title: String,
    topic: String,
    description: {type: String, default: ""},
    assignedDate: Date,
    dueDate: Date,
    finished: {type: Boolean, default: false},
    course: {type: Schema.Types.ObjectId, ref: "Course"},
    createdAt: {type: Date, default: Date.now}
});

module.exports = model("Assignment",assignmentSchema);