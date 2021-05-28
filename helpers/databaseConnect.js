const mongoose = require('mongoose');

/** Connects to the database */
const createConnection = async () => {
    console.log("Attempting to connect to the database...");
    mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err) console.log(`An error occurred: ${err}`);
        else console.log("Connected to the database.");
    })
}

module.exports.createConnection = createConnection;