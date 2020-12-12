const REDDIT_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const REDDIT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDDIT_CALLBACK = 'http://localhost:8080/connect/reddit/callback';
const MONGOOSE_REDDIT_KEY = 'reddit';

const REDDIT_PASSPORT_CONFIG = {
    clientID: REDDIT_CLIENT_ID,
    clientSecret: REDDIT_SECRET,
    callbackURL: REDDIT_CALLBACK,
    scope: [ 'read', 'identity' ],
    passReqToCallback: true
};

module.exports = {
    REDDIT_PASSPORT_CONFIG,
    REDDIT_CLIENT_ID,
    REDDIT_SECRET,
    MONGOOSE_REDDIT_KEY
};
