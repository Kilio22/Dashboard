const User = require('../models/User');
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = require('../config/spotifyConfig');
const SpotifyWebApi = require('spotify-web-api-node');
const { MONGOOSE_SPOTIFY_KEY } = require('../config/spotifyConfig');

async function getAccessToken(user) {
    const spotifyConnectData = user.connectData.get(MONGOOSE_SPOTIFY_KEY);
    const spotifyApi = getSpotifyClient(spotifyConnectData);

    await refreshAccessToken(spotifyApi, user);
    return spotifyApi.getAccessToken();
}

async function refreshAccessToken(spotifyApi, user) {
    const spotifyConnectData = user.connectData.get(MONGOOSE_SPOTIFY_KEY);

    try {
        const res = await spotifyApi.refreshAccessToken();
        let refreshToken = spotifyConnectData.refresh_token;

        if (res.body.refresh_token) {
            refreshToken = res.body.refresh_token;
        }
        user.connectData.set(MONGOOSE_SPOTIFY_KEY, {
            access_token: res.body.access_token,
            refresh_token: refreshToken
        });
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        spotifyApi.setAccessToken(res.body.access_token);
        spotifyApi.setRefreshToken(refreshToken);
    } catch (e) {
        user.connectData.delete(MONGOOSE_SPOTIFY_KEY);
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        throw {
            expressRes: {
                message: 'cannot get new access token, please connect to spotify and try again',
                code: 403
            }
        };
    }
}

async function getArtistInfos(artistId, user) {
    const spotifyConnectData = user.connectData.get(MONGOOSE_SPOTIFY_KEY);
    const spotifyApi = getSpotifyClient(spotifyConnectData);

    try {
        await refreshAccessToken(spotifyApi, user);
        const res = await spotifyApi.getArtist(artistId);
        return {
            id: res.body.id,
            name: res.body.name,
            popularity: res.body.popularity,
            genres: res.body.genres,
            followers: res.body.followers.total,
            image: res.body.images.find((img) => img.height === 320)?.url
        };
    } catch (e) {
        if (e.statusCode === 400 && e.body && e.body.error && !e.body.error.message.localeCompare('invalid id')) {
            throw {
                expressRes: {
                    message: 'cannot get artist infos because he/she doesn\'t exists',
                    code: 400
                }
            };
        } else {
            throw e;
        }
    }
}

function getSpotifyClient(spotifyConnectData) {
    return new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_SECRET,
        accessToken: spotifyConnectData.access_token,
        refreshToken: spotifyConnectData.refresh_token
    });
}

module.exports = {
    getAccessToken,
    getArtistInfos
};
