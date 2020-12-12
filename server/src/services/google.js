const User = require('../models/User');
const { MONGOOSE_GOOGLE_KEY } = require('../config/googleConfig');
const { GOOGLE_CLIENT_ID, GOOGLE_CALLBACK, GOOGLE_SECRET } = require('../config/googleConfig');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET,
    GOOGLE_CALLBACK
);

async function getAccessToken(user) {
    const googleConnectData = user.connectData.get(MONGOOSE_GOOGLE_KEY);

    oauth2Client.setCredentials({
        access_token: googleConnectData.access_token,
        refresh_token: googleConnectData.refresh_token
    });
    try {
        const getAccessTokenResponse = await oauth2Client.getAccessToken();
        const credentials = oauth2Client.credentials;

        user.connectData.set(MONGOOSE_GOOGLE_KEY, {
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token
        });
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        return getAccessTokenResponse.token;
    } catch (e) {
        user.connectData.delete(MONGOOSE_GOOGLE_KEY);
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        throw {
            expressRes: {
                message: 'cannot get new access token, please connect to google and try again',
                code: 403
            }
        };
    }
}

async function getChannelByChannelName(user, channelName) {
    await getAccessToken(user);
    const googleRes = await google.youtube('v3').channels.list({
        auth: oauth2Client,
        part: [
            'snippet,contentDetails,statistics'
        ],
        forUsername: channelName
    });

    if (!googleRes.data.items || !googleRes.data.items.length) {
        throw {
            expressRes: {
                message: 'cannot get channel infos because it doesn\'t exists',
                code: 400
            }
        };
    }
    return {
        title: googleRes.data.items[0].snippet.title,
        description: googleRes.data.items[0].snippet.description,
        thumbnail: googleRes.data.items[0].snippet.thumbnails.default,
        country: googleRes.data.items[0].snippet.country,
        statistics: googleRes.data.items[0].statistics
    };
}

async function getVideoById(user, videoId) {
    await getAccessToken(user);
    const googleRes = await google.youtube('v3').videos.list({
        auth: oauth2Client,
        part: [
            'snippet,contentDetails,statistics'
        ],
        id: videoId
    });

    if (!googleRes.data.items.length) {
        throw {
            expressRes: {
                message: 'cannot get video infos because it doesn\'t exists',
                code: 400
            }
        };
    }
    return {
        title: googleRes.data.items[0].snippet.title,
        description: googleRes.data.items[0].snippet.description,
        thumbnail: googleRes.data.items[0].snippet.thumbnails.default,
        channelTitle: googleRes.data.items[0].snippet.channelTitle,
        country: googleRes.data.items[0].snippet.country,
        statistics: googleRes.data.items[0].statistics
    };
}

module.exports = {
    getAccessToken,
    getChannelByChannelName,
    getVideoById
};
