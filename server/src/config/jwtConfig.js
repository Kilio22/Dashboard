const ExtractJWT = require('passport-jwt').ExtractJwt;
const decode = require('jsonwebtoken').decode;
const Axios = require('axios');
const {AZURE_ISSUER} = require('./msalConfig');

const JWT_SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
const FRONT_AZURE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const JWT_KEYS_URL = 'https://login.microsoftonline.com/{YOUR_TENANT_ID_HERE}/discovery/v2.0/keys';

async function getPrivateKey(request, rawJwtToken, done) {
    let decodedAccessToken = null;
    try {
        decodedAccessToken = decode(rawJwtToken, {complete: true});
    } catch (e) {
        return done(null, false);
    }

    try {
        if (!decodedAccessToken) {
            return done(null, false);
        }
        const response = await Axios.get(JWT_KEYS_URL);

        for (let key of response.data.keys) {
            if (key && key.kid === decodedAccessToken?.header?.kid && key.x5c && key.x5c.length) {
                const fullKey = '-----BEGIN CERTIFICATE-----\n' + key.x5c[0] + '\n-----END CERTIFICATE-----';
                return done(null, fullKey);
            }
        }
        return done(null, false);
    } catch (e) {
        return done(e, false);
    }
}

const JWT_PASSPORT_CONFIG = {
    audience: FRONT_AZURE_CLIENT_ID,
    issuer: AZURE_ISSUER,
    secretOrKeyProvider: getPrivateKey,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

module.exports = {
    JWT_PASSPORT_CONFIG,
    JWT_SECRET_KEY
};
