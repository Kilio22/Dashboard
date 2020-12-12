const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const SPOTIFY_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const SPOTIFY_CALLBACK = 'http://localhost:8080/connect/spotify/callback';
const MONGOOSE_SPOTIFY_KEY = 'spotify';

const SPOTIFY_PASSPORT_CONFIG = {
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_SECRET,
    callbackURL: SPOTIFY_CALLBACK,
    passReqToCallback: true
};

module.exports = {
    SPOTIFY_PASSPORT_CONFIG,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_SECRET,
    MONGOOSE_SPOTIFY_KEY
};
