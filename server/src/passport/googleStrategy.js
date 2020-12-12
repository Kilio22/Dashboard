const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const { MONGOOSE_GOOGLE_KEY } = require('../config/googleConfig');
const { GOOGLE_PASSPORT_CONFIG } = require('../config/googleConfig');

passport.use(new GoogleStrategy(GOOGLE_PASSPORT_CONFIG,
    async function (req, accessToken, refreshToken, profile, cb) {
        const user = req.user;

        try {
            user.connectData.set(MONGOOSE_GOOGLE_KEY, { refresh_token: refreshToken });
            await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
            return cb(null, user);
        } catch (e) {
            return cb(null, false);
        }
    }
));
