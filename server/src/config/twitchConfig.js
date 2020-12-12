const TWITCH_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const TWITCH_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const TWITCH_CALLBACK = 'http://localhost:8080/connect/twitch/callback';
const MONGOOSE_TWITCH_KEY = 'twitch';

const TWITCH_PASSPORT_CONFIG = {
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: TWITCH_CALLBACK,
    scope: 'user:read:email',
    passReqToCallback: true
};

module.exports = {
    TWITCH_PASSPORT_CONFIG,
    TWITCH_SECRET,
    TWITCH_CLIENT_ID,
    MONGOOSE_TWITCH_KEY
};
