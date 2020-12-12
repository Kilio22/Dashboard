const isLoggedIn = require('../passport/isLoggedIn');
const express = require('express');
const router = express.Router();
const twitch = require('../services/twitch');
const { MONGOOSE_TWITCH_KEY } = require('../config/twitchConfig');

/**
 * @swagger
 *
 * /twitch/logged:
 *   get:
 *     summary: Checks if user is authenticated to Twitch service.
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
    if (!req.user.connectData.get(MONGOOSE_TWITCH_KEY)) {
        return res.send({ authenticated: false });
    }
    try {
        await twitch.getAccessToken(req.user);
        return res.send({ authenticated: true });
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /twitch/users/{username}:
 *   get:
 *     summary: Gets information about specified Twitch user.
 *     parameters:
 *       - name: username
 *         required: true
 *         description: Twitch username.
 *         in: path
 *     responses:
 *       200:
 *          description: User information.
 *       400:
 *          description: Username is empty or user does not exists.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Twitch service.
 *       500:
 *         description: Error.
 */
router.get('/users/:username', isLoggedIn, async (req, res) => {
    const username = req.params.username.trim();

    if (!req.user.connectData.get(MONGOOSE_TWITCH_KEY)) {
        return res.sendStatus(403);
    }
    if (!username) {
        return res.sendStatus(400);
    }
    try {
        const body = await twitch.getUserByUsername(req.user, username);
        return res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /twitch/streams/{username}:
 *   get:
 *     summary: Gets information about the stream of a specified Twitch user.
 *     parameters:
 *       - name: username
 *         required: true
 *         description: Twitch username.
 *         in: path
 *     responses:
 *       200:
 *          description: Stream information.
 *       400:
 *          description: Username is empty or user is not on air.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Twitch service.
 *       500:
 *         description: Error.
 */
router.get('/streams/:username', isLoggedIn, async (req, res) => {
    const username = req.params.username.trim();

    if (!req.user.connectData.get(MONGOOSE_TWITCH_KEY)) {
        return res.sendStatus(403);
    }
    if (!username) {
        return res.sendStatus(400);
    }
    try {
        const body = await twitch.getStreamByUsername(req.user, username);
        return res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

module.exports = router;
