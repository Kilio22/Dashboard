const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const User = require('../models/User');
const { MONGOOSE_TWITCH_KEY } = require('../config/twitchConfig');
const { TWITCH_PASSPORT_CONFIG } = require('../config/twitchConfig');

passport.use(new TwitchStrategy(TWITCH_PASSPORT_CONFIG,
    async function (req, accessToken, refreshToken, profile, done) {
        const user = req.user;

        try {
            user.connectData.set(MONGOOSE_TWITCH_KEY, { access_token: accessToken, refresh_token: refreshToken });
            await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
            return done(null, user);
        } catch (e) {
            return done(null, false);
        }
    }
));
