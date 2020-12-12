const isLoggedIn = require('../passport/isLoggedIn');
const express = require('express');
const router = express.Router();
const google = require('../services/google');
const { MONGOOSE_GOOGLE_KEY } = require('../config/googleConfig');

/**
 * @swagger
 *
 * /google/logged:
 *   get:
 *     summary: Checks if user is authenticated to Google service.
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
    if (!req.user.connectData.get(MONGOOSE_GOOGLE_KEY)) {
        return res.send({ authenticated: false });
    }
    try {
        await google.getAccessToken(req.user);
        return res.send({ authenticated: true });
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        return res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /google/channels/{channel}:
 *   get:
 *     summary: Gets information about given youtube channel.
 *     parameters:
 *       - name: channel
 *         required: true
 *         description: Youtube channel name.
 *         in: path
 *     responses:
 *       200:
 *          description: Channel information.
 *       400:
 *          description: Channel name is empty or given channel does not exists.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Google service.
 *       500:
 *         description: Error.
 */
router.get('/channels/:channel', isLoggedIn, async (req, res) => {
    const channelName = req.params.channel.trim();

    if (!req.user.connectData.get(MONGOOSE_GOOGLE_KEY)) {
        return res.sendStatus(403);
    }
    if (!channelName) {
        return res.sendStatus(400);
    }
    try {
        const body = await google.getChannelByChannelName(req.user, channelName);
        return res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        return res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /google/videos/{id}:
 *   get:
 *     summary: Gets information about the given video.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: ID of the video.
 *         in: path
 *     responses:
 *       200:
 *          description: Video information.
 *       400:
 *          description: ID is empty or video with given ID does not exists.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Google service.
 *       500:
 *         description: Error.
 */
router.get('/videos/:id', isLoggedIn, async (req, res) => {
    const videoId = req.params.id.trim();

    if (!req.user.connectData.get(MONGOOSE_GOOGLE_KEY)) {
        return res.sendStatus(403);
    }
    if (!videoId) {
        return res.sendStatus(400);
    }
    try {
        const body = await google.getVideoById(req.user, videoId);
        return res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
