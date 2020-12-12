const express = require('express');
const isLoggedIn = require('../passport/isLoggedIn');
const router = express.Router();
const microsoft = require('../services/microsoft');

/**
 * @swagger
 *
 * /microsoft/logged:
 *   get:
 *     summary: Checks if user is authenticated to Microsoft service.
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
    if (!req.user.microsoftConnectData.isConnected) {
        return res.send({ authenticated: false });
    }
    try {
        await microsoft.getAccessToken(req.user, req.user.microsoftConnectData.homeAccountId, req.app.locals.msalClient);
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
 * /microsoft/mail/folders:
 *   get:
 *     summary: Gets mailbox folder list of connected user.
 *     responses:
 *       200:
 *          description: Mailbox folder list.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Microsoft service.
 *       500:
 *         description: Error.
 */
router.get('/mail/folders', isLoggedIn, async (req, res) => {
    if (!req.user.microsoftConnectData.isConnected) {
        return res.sendStatus(403);
    }
    try {
        const body = await microsoft.getMailFolders(req.user, req.app.locals.msalClient);
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
 * /microsoft/mail/folders/{id}:
 *   get:
 *     summary: Gets content of given mailbox folder.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: Folder id.
 *         in: path
 *     responses:
 *       200:
 *          description: Emails inside specified mailbox folder.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Microsoft service.
 *       500:
 *         description: Error.
 */
router.get('/mail/folders/:id', isLoggedIn, async (req, res) => {
    const folderId = req.params.id.trim();

    if (!req.user.microsoftConnectData.isConnected) {
        return res.sendStatus(403);
    }
    if (!folderId) {
        return res.sendStatus(400);
    }
    try {
        const body = await microsoft.getMessagesByFolder(req.user, folderId, req.app.locals.msalClient);
        res.send(body);
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
 * /microsoft/calendars:
 *   get:
 *     summary: Gets available calendars of connected user.
 *     responses:
 *       200:
 *          description: Calendar list of connect user.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Microsoft service.
 *       500:
 *         description: Error.
 */
router.get('/calendars', isLoggedIn, async (req, res) => {
    if (!req.user.microsoftConnectData.isConnected) {
        return res.sendStatus(403);
    }
    try {
        const body = await microsoft.getCalendars(req.user, req.app.locals.msalClient);
        res.send(body);
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
 * /microsoft/calendars/{id}:
 *   get:
 *     summary: Gets specific calendar's events.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: Calendar id.
 *         in: path
 *     responses:
 *       200:
 *          description: Specific calendar's events.
 *       401:
 *         description: Not authenticated to the app.
 *       403:
 *         description: Not authenticated to Microsoft service.
 *       500:
 *         description: Error.
 */
router.get('/calendars/:id', isLoggedIn, async (req, res) => {
    const calendarId = req.params.id.trim();

    if (!req.user.microsoftConnectData.isConnected) {
        return res.sendStatus(403);
    }
    if (!calendarId) {
        return res.sendStatus(400);
    }
    try {
        const body = await microsoft.getEventByCalendar(req.user, calendarId, req.app.locals.msalClient);
        res.send(body);
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
