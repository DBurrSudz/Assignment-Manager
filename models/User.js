const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
    createdAt: {type: Date, default: Date.now()}
});


module.exports = model("User",userSchema);