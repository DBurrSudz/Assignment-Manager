const {Schema, model} = require('mongoose');
const Assignment = require("./Assignment");

const courseSchema = new Schema({
    title: String,
    code: String,
    description: {type: String, default: ""},
    createdAt: {type: Date, default: Date.now},
    assignmentCount: {type: Number, default: 0},
    student: {type: Schema.Types.ObjectId, ref: "User"},
    assignments: [{type: Schema.Types.ObjectId, ref: "Assignment"}]
});


courseSchema.pre("deleteOne", {document: true}, (next) => {
    Assignment.deleteMany({course: this._id}, (err) => {
        if(err) return;
        else next();
    });
});

module.exports = model("Course",courseSchema);