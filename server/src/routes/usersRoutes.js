const express = require('express');
const isLoggedIn = require('../passport/isLoggedIn');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - id
 *       - email
 *       - displayName
 *     properties:
 *       id:
 *         type: string
 *       email:
 *         type: string
 *       displayName:
 *         type: string
 */

/**
 * @swagger
 *
 * /users:
 *   get:
 *     summary: Gets user list.
 *     responses:
 *       200:
 *          description: The user list.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.get('/', isLoggedIn, (async (req, res) => {
    try {
        const users = await User.find({});

        res.json(users.map(user => {
            return {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            };
        }));
    } catch (e) {
        res.sendStatus(500);
    }
}));

/**
 * @swagger
 *
 * /users/{id}:
 *   delete:
 *     summary: Deletes given user from user list.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: User ID.
 *         in: path
 *     responses:
 *       200:
 *          description: The updated user list.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       400:
 *         description: The given id is not assigned to a user.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.delete('/:id', isLoggedIn, (async (req, res) => {
    const id = req.params.id.trim();

    if (!id) {
        return res.sendStatus(400);
    }
    try {
        await User.deleteOne({ _id: id });
        const users = await User.find({});

        res.json(users.map(user => {
            return {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            };
        }));
    } catch (e) {
        res.sendStatus(500);
    }
}));

module.exports = router;
