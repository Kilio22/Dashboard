const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const User = require('../models/User');
const { MONGOOSE_REDDIT_KEY } = require('../config/redditConfig');
const { REDDIT_PASSPORT_CONFIG } = require('../config/redditConfig');

passport.use(new RedditStrategy(REDDIT_PASSPORT_CONFIG,
    async (req, accessToken, refreshToken, profile, done) => {
        const user = req.user;

        try {
            user.connectData.set(MONGOOSE_REDDIT_KEY, { access_token: accessToken, refresh_token: refreshToken });
            await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
            return done(null, user);
        } catch (e) {
            return done(null, false);
        }
    }
));
