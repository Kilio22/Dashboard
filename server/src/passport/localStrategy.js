const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { LOCAL_PASSPORT_CONFIG } = require('../config/localConfig');

passport.use('local-signin', new Strategy(LOCAL_PASSPORT_CONFIG,
    async function (req, email, password, cb) {
        try {
            let user = await User.findOne({ email, isMicrosoftAuthed: false });

            if (!user) {
                return cb(null, false);
            } else {
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return cb(null, false);
                }
                return cb(null, user);
            }
        } catch (error) {
            return cb(error);
        }
    }));

passport.use('local-signup', new Strategy(LOCAL_PASSPORT_CONFIG,
    async function (req, email, password, cb) {
        if (!req.body.fullName) {
            return cb(null, false, { code: 400, message: 'Missing fullName property.' });
        }
        try {
            let user = await User.findOne({ email, isMicrosoftAuthed: false });

            if (user) {
                return cb(null, false, { code: 409, message: 'A user with the given email already exists.' });
            } else {
                user = await User.create({
                    email,
                    password,
                    displayName: req.body.fullName
                });
                return cb(null, user);
            }
        } catch (error) {
            return cb(error);
        }
    }));
