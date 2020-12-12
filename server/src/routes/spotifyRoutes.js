const isLoggedIn = require('../passport/isLoggedIn');
const express = require('express');
const router = express.Router();
const spotify = require('../services/spotify');
const { MONGOOSE_SPOTIFY_KEY } = require('../config/spotifyConfig');

/**
 * @swagger
 *
 * /spotify/logged:
 *   get:
 *     summary: Checks if user is authenticated to Spotify service.
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
    if (!req.user.connectData.get(MONGOOSE_SPOTIFY_KEY)) {
        return res.send({ authenticated: false });
    }
    try {
        await spotify.getAccessToken(req.user);
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
 * /spotify/artists/{id}:
 *   get:
 *     summary: Gets information about specified artist.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: Artist Spotify ID.
 *         in: path
 *     responses:
 *       200:
 *          description: Artist information.
 *       400:
 *          description: Artist id is empty OR artist does not exists.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Spotify service.
 *       500:
 *         description: Error.
 */
router.get('/artists/:id', isLoggedIn, async (req, res) => {
    const artistId = req.params.id.trim();

    if (!req.user.connectData.get(MONGOOSE_SPOTIFY_KEY)) {
        return res.sendStatus(403);
    }
    if (!artistId) {
        return res.sendStatus(400);
    }
    try {
        const body = await spotify.getArtistInfos(artistId, req.user);
        return res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

module.exports = router;
