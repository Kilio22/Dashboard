const express = require('express');
const isLoggedIn = require('../passport/isLoggedIn');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
require('../passport/googleStrategy');
require('../passport/twitchStrategy');
require('../passport/spotifyStrategy');
require('../passport/redditStrategy');
const { FRONT_BASE_URI } = require('../config/config');
const microsoft = require('../services/microsoft');

/**
 * @swagger
 *
 * /connect/microsoft:
 *   get:
 *     summary: Login to Microsoft service.
 *     responses:
 *       302:
 *         description: Redirects to Microsoft login page. On error, redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/microsoft', isLoggedIn, async function (req, res) {
    const urlParameters = {
        scopes: [ 'profile', 'openid', 'offline_access', 'email', 'Mail.Read', 'Calendars.Read', 'User.Read', 'MailboxSettings.Read' ],
        redirectUri: 'http://localhost:8080/connect/microsoft/callback',
        prompt: 'select_account'
    };
    try {
        const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(urlParameters);
        res.redirect(authUrl);
    } catch (error) {
        return res.redirect(FRONT_BASE_URI + 'home');
    }
});

/**
 * @swagger
 *
 * /connect/microsoft/callback:
 *   get:
 *     summary: Callback used to catch Microsoft authentication response.
 *     responses:
 *       302:
 *         description: Redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/microsoft/callback', isLoggedIn, async function (req, res) {
    const tokenRequest = {
        code: req.query.code,
        scopes: [ 'profile', 'openid', 'offline_access', 'email', 'Mail.Read', 'Calendars.Read', 'User.Read', 'MailboxSettings.Read' ],
        redirectUri: 'http://localhost:8080/connect/microsoft/callback'
    };

    try {
        const response = await req.app.locals
                                  .msalClient.acquireTokenByCode(tokenRequest);
        const userDetails = await microsoft.getUserDetails(response.accessToken);

        req.user.microsoftConnectData = {
            isConnected: true,
            homeAccountId: response.account.homeAccountId,
            timeZone: userDetails.mailboxSettings.timeZone
        };
        await User.updateOne({ email: req.user.email, isMicrosoftAuthed: req.user.isMicrosoftAuthed }, req.user);
    } catch (error) {
        return res.redirect(FRONT_BASE_URI + '/home');
    }
    return res.redirect(FRONT_BASE_URI + '/home');
});

/**
 * @swagger
 *
 * /connect/google:
 *   get:
 *     summary: Login to Google service.
 *     responses:
 *       302:
 *         description: Redirects to Google login page. On error, redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/google', isLoggedIn, passport.authenticate('google', {
    scope: [ 'email', 'profile', 'openid', 'https://www.googleapis.com/auth/youtube.readonly' ],
    accessType: 'offline',
    prompt: 'consent',
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/google/callback:
 *   get:
 *     summary: Callback used to catch Google authentication response.
 *     responses:
 *       302:
 *         description: Redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/google/callback', isLoggedIn, passport.authenticate('google', {
    scope:
        [ 'email', 'profile', 'openid', 'https://www.googleapis.com/auth/youtube.readonly' ],
    accessType: 'offline',
    successRedirect: FRONT_BASE_URI + '/home',
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/twitch:
 *   get:
 *     summary: Login to Twitch service.
 *     responses:
 *       302:
 *         description: Redirects to Twitch login page. On error, redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/twitch', isLoggedIn, passport.authenticate('twitch', {
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/twitch/callback:
 *   get:
 *     summary: Callback used to catch Twitch authentication response.
 *     responses:
 *       302:
 *         description: Redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/twitch/callback', isLoggedIn, passport.authenticate('twitch', {
    successRedirect: FRONT_BASE_URI + '/home',
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/spotify:
 *   get:
 *     summary: Login to Spotify service.
 *     responses:
 *       302:
 *         description: Redirects to Spotify login page. On error, redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/spotify', isLoggedIn, passport.authenticate('spotify', {
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/spotify/callback:
 *   get:
 *     summary: Callback used to catch Spotify authentication response.
 *     responses:
 *       302:
 *         description: Redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/spotify/callback', isLoggedIn, passport.authenticate('spotify', {
    successRedirect: FRONT_BASE_URI + '/home',
    failureRedirect: FRONT_BASE_URI + '/home'
}));

/**
 * @swagger
 *
 * /connect/reddit:
 *   get:
 *     summary: Login to Reddit service.
 *     responses:
 *       302:
 *         description: Redirects to Reddit login page. On error, redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/reddit', isLoggedIn, passport.authenticate('reddit', {
    failureRedirect: FRONT_BASE_URI + '/home',
    duration: 'permanent',
    state: 'toto'
}));

/**
 * @swagger
 *
 * /connect/reddit/callback:
 *   get:
 *     summary: Callback used to login to Reddit service.
 *     responses:
 *       302:
 *         description: Redirects to app home page.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/reddit/callback', isLoggedIn, passport.authenticate('reddit', {
    successRedirect: FRONT_BASE_URI + '/home',
    failureRedirect: FRONT_BASE_URI + '/home',
    duration: 'permanent'
}));

module.exports = router;
