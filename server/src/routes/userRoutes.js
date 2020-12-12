const express = require('express');
const isLoggedIn = require('../passport/isLoggedIn');
const router = express.Router();
const widgets = require('../services/widgets');

/**
 * @swagger
 *
 * definitions:
 *   Widget:
 *     type: object
 *     required:
 *       - id
 *       - type
 *       - x
 *       - y
 *       - refreshRate
 *     properties:
 *       id:
 *         type: string
 *       type:
 *         type: string
 *       x:
 *         type: number
 *       y:
 *         type: number
 *       refreshRate:
 *         type: number
 *       query:
 *         type: string
 */

/**
 * @swagger
 *
 * /user/profile:
 *   get:
 *     summary: Gets information about connected user.
 *     responses:
 *       200:
 *          description: Information about the user.
 *       401:
 *         description: Not authenticated to the app.
 */
router.get('/profile', isLoggedIn, (req, res) => {
    res.send({ email: req.user.email, displayName: req.user.displayName });
});

/**
 * @swagger
 *
 * /user/widgets:
 *   get:
 *     summary: Gets configuration of saved widgets.
 *     responses:
 *       200:
 *          description: Widgets configuration.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Widget'
 *       401:
 *         description: Not authenticated to the app.
 */
router.get('/widgets', isLoggedIn, (req, res) => {
    res.send(req.user.widgetsConfig.map(widgetConfig => {
        return {
            id: widgetConfig.id,
            type: widgetConfig.type,
            x: widgetConfig.x,
            y: widgetConfig.y,
            refreshRate: widgetConfig.refreshRate,
            query: widgetConfig.query
        };
    }));
});

/**
 * @swagger
 *
 * /user/widgets/{id}:
 *   get:
 *     summary: Gets configuration of specific widget.
 *     parameters:
 *       - name: id
 *         required: true
 *         description: Widget ID.
 *         in: path
 *     responses:
 *       200:
 *          description: Widget configuration.
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Widget'
 *       400:
 *          description: The given widget does not exists.
 *       401:
 *         description: Not authenticated to the app.
 */
router.get('/widgets/:id', isLoggedIn, (req, res) => {
    const id = req.params.id.trim();
    if (!id) {
        return res.sendStatus(400);
    }

    const askedWidget = req.user.widgetsConfig.find(widget => widget.id === id);
    if (!askedWidget) {
        return res.sendStatus(400);
    }
    res.send({
        id: askedWidget.id,
        type: askedWidget.type,
        x: askedWidget.x,
        y: askedWidget.y,
        refreshRate: askedWidget.refreshRate,
        query: askedWidget.query
    });
});

/**
 * @swagger
 *
 * /user/widgets/grid:
 *   post:
 *     summary: Saves grid configuration of given widgets.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 x:
 *                   type: number
 *                 y:
 *                   type: number
 *                 refreshRate:
 *                   type: number
 *     responses:
 *       201:
 *          description: Widgets configuration.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Widget'
 *       400:
 *          description: No widget found in request body.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.post('/widgets/grid', isLoggedIn, async (req, res) => {
    let user = req.user;
    const givenWidgets = req.body;

    if (!givenWidgets || !Array.isArray(givenWidgets)) {
        return res.sendStatus(400);
    }
    try {
        await widgets.storeWidgetsGridConfig(givenWidgets, user);
        res.status(201).send(user.widgetsConfig.map(widgetConfig => {
            return {
                id: widgetConfig.id,
                type: widgetConfig.type,
                x: widgetConfig.x,
                y: widgetConfig.y,
                refreshRate: widgetConfig.refreshRate,
                query: widgetConfig.query
            };
        }));
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
 * /user/widgets/query:
 *   post:
 *     summary: Saves query configuration of given widgets.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 query:
 *                   type: string
 *     responses:
 *       201:
 *          description: Widgets configuration.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Widget'
 *       400:
 *          description: No widget found in request body.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.post('/widgets/query', isLoggedIn, async (req, res) => {
    let user = req.user;
    const givenWidgets = req.body;

    if (!givenWidgets || !Array.isArray(givenWidgets)) {
        return res.sendStatus(400);
    }
    try {
        await widgets.storeWidgetsQueryConfig(givenWidgets, user);
        res.status(201).send(user.widgetsConfig.map(widgetConfig => {
            return {
                id: widgetConfig.id,
                type: widgetConfig.type,
                x: widgetConfig.x,
                y: widgetConfig.y,
                refreshRate: widgetConfig.refreshRate,
                query: widgetConfig.query
            };
        }));
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
 * /user/widgets/grid:
 *   delete:
 *     summary: Removes widgets from storage.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 x:
 *                   type: number
 *                 y:
 *                   type: number
 *                 refreshRate:
 *                   type: number
 *                 query:
 *                   type: string
 *     responses:
 *       201:
 *          description: Widgets configuration.
 *          content:
 *            application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Widget'
 *       400:
 *          description: No widget found in request body.
 *       401:
 *         description: Not authenticated to the app.
 *       500:
 *         description: Error.
 */
router.delete('/widgets', isLoggedIn, async (req, res) => {
    let user = req.user;
    const givenWidgets = req.body;

    if (!givenWidgets || !Array.isArray(givenWidgets)) {
        return res.sendStatus(400);
    }
    try {
        await widgets.deleteWidgets(givenWidgets, user);
        res.status(200).send(user.widgetsConfig.map(widgetConfig => {
            return {
                id: widgetConfig.id,
                type: widgetConfig.type,
                x: widgetConfig.x,
                y: widgetConfig.y,
                refreshRate: widgetConfig.refreshRate,
                query: widgetConfig.query
            };
        }));
    } catch (e) {
        if (e.expressRes) {
            return res.status(e.expressRes.code).send(e.expressRes.message);
        }
        res.sendStatus(500);
    }
});

module.exports = router;
