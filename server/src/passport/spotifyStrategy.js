const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');
const { MONGOOSE_SPOTIFY_KEY } = require('../config/spotifyConfig');
const { SPOTIFY_PASSPORT_CONFIG } = require('../config/spotifyConfig');

passport.use(new SpotifyStrategy(SPOTIFY_PASSPORT_CONFIG,
    async function (req, accessToken, refreshToken, expires_in, profile, done) {
        const user = req.user;

        try {
            user.connectData.set(MONGOOSE_SPOTIFY_KEY, { access_token: accessToken, refresh_token: refreshToken });
            await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
            return done(null, user);
        } catch (e) {
            return done(null, false);
        }
    }
));
