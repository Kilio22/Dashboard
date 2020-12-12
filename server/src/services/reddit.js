const { REDDIT_CLIENT_ID, REDDIT_SECRET } = require('../config/redditConfig');
const snoowrap = require('snoowrap');
const { MONGOOSE_REDDIT_KEY } = require('../config/redditConfig');

function getSnoowrapClient(redditConnectData) {
    return new snoowrap({
        clientId: REDDIT_CLIENT_ID,
        clientSecret: REDDIT_SECRET,
        refreshToken: redditConnectData.refresh_token,
        userAgent: 'Dashboard/1.0 by KN'
    });
}

async function getSubredditInfos(subredditId, user) {
    const redditConnectData = user.connectData.get(MONGOOSE_REDDIT_KEY);
    const client = getSnoowrapClient(redditConnectData);

    try {
        const res = await client.getSubreddit(subredditId).fetch();
        return {
            display_name: res.display_name,
            active_user_count: res.active_user_count,
            subscribers: res.subscribers,
            created_utc: res.created_utc,
            lang: res.lang
        };
    } catch (e) {
        if (e.toString().includes('does not exist')) {
            throw {
                expressRes: {
                    message: 'cannot get subreddit infos because it doesn\'t exists',
                    code: 400
                }
            };
        }
        if (e.statusCode === 403) {
            throw {
                expressRes: {
                    message: 'you do not have the rights to access to this subreddit',
                    code: 400
                }
            };
        }
        throw e;
    }
}

module.exports = {
    getSubredditInfos
};
