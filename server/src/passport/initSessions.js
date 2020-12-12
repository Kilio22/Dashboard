const User = require('../models/User');
const passport = require('passport');

passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(function (_id, cb) {
    User.findById(_id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});
