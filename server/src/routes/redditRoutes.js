const isLoggedIn = require('../passport/isLoggedIn');
const express = require('express');
const router = express.Router();
const reddit = require('../services/reddit');
const { MONGOOSE_REDDIT_KEY } = require('../config/redditConfig');

/**
 * @swagger
 *
 * /reddit/logged:
 *   get:
 *     summary: Checks if user is authenticated to Reddit service.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/logged', isLoggedIn, async (req, res) => {
    if (!req.user.connectData.get(MONGOOSE_REDDIT_KEY)) {
        return res.send({ authenticated: false });
    }
    return res.send({ authenticated: true });
});

/**
 * @swagger
 *
 * /reddit/subreddits/{name}:
 *   get:
 *     summary: Gets subreddit information.
 *     parameters:
 *       - name: name
 *         required: true
 *         description: Subreddit name.
 *         in: path
 *     responses:
 *       200:
 *          description: Subreddit information.
 *       400:
 *          description: Subreddit name is empty OR given subreddit does not exists OR you don't have necessary rights to access to specified subreddit.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Reddit service.
 *       500:
 *         description: Error.
 */
router.get('/subreddits/:name', isLoggedIn, async (req, res) => {
    const subredditName = req.params.name.trim();

    if (!req.user.connectData.get(MONGOOSE_REDDIT_KEY)) {
        return res.sendStatus(403);
    }
    if (!subredditName) {
        return res.sendStatus(400);
    }
    try {
        const body = await reddit.getSubredditInfos(subredditName, req.user);
        res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

module.exports = router;
