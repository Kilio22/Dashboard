const express = require('express');
const isLoggedIn = require('../passport/isLoggedIn');
const router = express.Router();
const weatherJs = require('weather-js');

/**
 * @swagger
 *
 * /weather:
 *   get:
 *     summary: Gets information about the weather in a given place.
 *     parameters:
 *       - name: q
 *         required: true
 *         description: City name.
 *         in: query
 *       - name: degree
 *         required: false
 *         description: F for Fahrenheit or C for degree Celsius
 *         in: query
 *     responses:
 *       200:
 *          description: Weather information.
 *       400:
 *          description: City name is empty.
 *       500:
 *         description: Error.
 */
router.get('/', isLoggedIn, async (req, res) => {
    const query = req.query.q?.trim();
    const degree = req.query.degree?.trim() || 'C';

    if (!query) {
        return res.sendStatus(400);
    }
    weatherJs.find({ search: query, degreeType: degree }, (err, result) => {
        if (err) {
            return res.sendStatus(500);
        }
        const body = result.map((value) => {
            return value.current;
        });
        res.send(body);
    });
});

module.exports = router;
