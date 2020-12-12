const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../passport/localStrategy');
require('../passport/jwtStrategy');
const isLoggedIn = require('../passport/isLoggedIn');
const { FRONT_BASE_URI } = require('../config/config');
const { JWT_SECRET_KEY } = require('../config/jwtConfig');

/**
 * @swagger
 *
 * /auth/sign-in:
 *   post:
 *     summary: Authenticate to the application.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Cannot find email or password.
 *       401:
 *         description: Wrong credentials.
 *       500:
 *         description: Error.
 */
router.post('/sign-in',
    passport.authenticate('local-signin'),
    function (req, res) {
        let user = req.user;
        const body = { email: user.email, displayName: user.displayName };
        const token = jwt.sign({ user: body }, JWT_SECRET_KEY, { expiresIn: '7 days' });
        res.json({ token });
    });

/**
 * @swagger
 *
 * /auth/sign-up:
 *   post:
 *     summary: Register to the application.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: fullName
 *         in: formData
 *         required: true
 *         type: string
 *         description: Username.
 *     responses:
 *       200:
 *         description: Registered and authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Cannot find email or password or fullName.
 *       409:
 *         description: A user with the given email already exists.
 *       500:
 *         description: Error.
 */
router.post('/sign-up', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (!user) {
            if (info.hasOwnProperty('code') && info.hasOwnProperty('message')) {
                return res.status(info.code).json({ message: info.message });
            } else {
                return res.sendStatus(400);
            }
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const body = { email: user.email, displayName: user.displayName };
            const token = jwt.sign({ user: body }, JWT_SECRET_KEY, { expiresIn: '7 days' });
            res.json({ token });
        });
    })(req, res, next);
});

/**
 * @swagger
 *
 * /auth/ping:
 *   get:
 *     summary: Checks if current session is valid.
 *     responses:
 *       200:
 *         description: Authenticated.
 *         content:
 *           text/plain:
 *             schema:
 *               type: boolean
 *       401:
 *         description: Invalid session.
 */
router.get('/ping',
    isLoggedIn,
    function (req, res) {
        res.send(true);
    });

/**
 * @swagger
 *
 * /auth/office-jwt:
 *   get:
 *     summary: Sign-in or sign-up to the app using a Microsoft Azure OAuth 2.0 token.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *     responses:
 *       200:
 *         description: Authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing token or bad token.
 *       500:
 *         description: Error.
 */
router.get('/office-jwt',
    function (req, res, next) {
        passport.authenticate('office-jwt', function (err, user) {
            if (err) {
                return res.sendStatus(500);
            }

            if (!user) {
                return res.sendStatus(400);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                const body = { email: user.email, displayName: user.displayName };
                const token = jwt.sign({ user: body }, JWT_SECRET_KEY, { expiresIn: '7 days' });
                res.json({ token });
            });
        })(req, res, next);
    });

/**
 * @swagger
 *
 * /auth/logout:
 *   get:
 *     summary: Ends session.
 *     responses:
 *       302:
 *         description: Session ended, redirecting to login page.
 */
router.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect(FRONT_BASE_URI + '/auth/login');
    });

module.exports = router;
