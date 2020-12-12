const User = require('../models/User');
const { MONGOOSE_TWITCH_KEY } = require('../config/twitchConfig');
const { TWITCH_SECRET, TWITCH_CLIENT_ID } = require('../config/twitchConfig');
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const { ApiClient } = require('twitch');

function getAuthProvider(user) {
    const twitchConnectData = user.connectData.get(MONGOOSE_TWITCH_KEY);

    return new RefreshableAuthProvider(
        new StaticAuthProvider(TWITCH_CLIENT_ID, twitchConnectData.access_token), {
            clientSecret: TWITCH_SECRET,
            refreshToken: twitchConnectData.refresh_token,
            expiry: 0,
            onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
                user.connectData.set(MONGOOSE_TWITCH_KEY, { access_token: accessToken, refresh_token: refreshToken });
                await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
            }
        }
    );
}

async function getAccessToken(user) {
    try {
        const authProvider = getAuthProvider(user);
        return await authProvider.getAccessToken('user:read:email');
    } catch (e) {
        user.connectData.delete(MONGOOSE_TWITCH_KEY);
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        throw {
            expressRes: {
                message: 'cannot get new access token, please connect to twitch and try again',
                code: 403
            }
        };
    }
}

async function getUserByUsername(user, username) {
    const authProvider = getAuthProvider(user);
    const twitchClient = new ApiClient({ authProvider });
    const body = await twitchClient.helix.users.getUserByName(username);

    if (!body) {
        throw {
            expressRes: {
                message: 'cannot get user infos because it doesn\'t exists',
                code: 400
            }
        };
    }
    return body._data;
}

async function getStreamByUsername(user, username) {
    const authProvider = getAuthProvider(user);
    const twitchClient = new ApiClient({ authProvider });
    const body = await twitchClient.helix.streams.getStreamByUserName(username);

    if (!body) {
        throw {
            expressRes: {
                message: 'cannot get stream infos because it doesn\'t exists',
                code: 400
            }
        };
    }
    return body._data;
}

module.exports = {
    getAccessToken,
    getUserByUsername,
    getStreamByUsername
};
