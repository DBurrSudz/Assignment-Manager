const createError = require('http-errors');
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const session = require("express-session");
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('morgan');

const welcomeRouter = require('./routes/welcome');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const profileRouter = require('./routes/profile');

const app = express();


dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true,
        domain: "localhost",
        path: "/"
    }
}))

app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require("moment");

// routers setup
app.use('/', welcomeRouter);
app.use('/users', usersRouter);
app.use("/courses",coursesRouter);
app.use("/profile",profileRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
