const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const GOOGLE_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const GOOGLE_CALLBACK = 'http://localhost:8080/connect/google/callback';
const MONGOOSE_GOOGLE_KEY = 'google';

const GOOGLE_PASSPORT_CONFIG = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
    callbackURL: GOOGLE_CALLBACK,
    passReqToCallback: true
};

module.exports = {
    GOOGLE_PASSPORT_CONFIG,
    GOOGLE_SECRET,
    GOOGLE_CALLBACK,
    GOOGLE_CLIENT_ID,
    MONGOOSE_GOOGLE_KEY
};
