const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const msal = require('@azure/msal-node');
const authRouter = require('./src/routes/authRoutes');
const connectRouter = require('./src/routes/connectRoutes');
const weatherRouter = require('./src/routes/weatherRoutes');
const microsoftRouter = require('./src/routes/microsoftRoutes');
const googleRouter = require('./src/routes/googleRoutes');
const userRouter = require('./src/routes/userRoutes');
const usersRouter = require('./src/routes/usersRoutes');
const twitchRouter = require('./src/routes/twitchRoutes');
const spotifyRouter = require('./src/routes/spotifyRoutes');
const redditRouter = require('./src/routes/redditRoutes');
require('./src/passport/initSessions');
const { AZURE_CLIENT_ID, AZURE_AUTHORITY, AZURE_CLIENT_SECRET } = require('./src/config/msalConfig');
const { MONGO_URI, MONGO_DB_NAME, MONGO_USER, MONGO_PASSWORD } = require('./src/config/mongoConfig');
const { ALLOWED_ORIGINS } = require('./src/config/config');
const about = require('./src/about.json');
const moment = require('moment');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Dashboard',
            version: '1.0.0'
        }
    },
    apis: [ './src/routes/*Routes*.js' ]
};

const swaggerSpec = swaggerJSDoc(options);
const port = 8080;

function startServer() {
    const app = express();

    const MSAL_CONFIG = {
        auth: {
            clientId: AZURE_CLIENT_ID,
            authority: AZURE_AUTHORITY,
            clientSecret: AZURE_CLIENT_SECRET
        },
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: msal.LogLevel.Verbose
            }
        }
    };

    app.locals.msalClient = new msal.ConfidentialClientApplication(MSAL_CONFIG);

    app.use(require('morgan')('combined'));
    app.use(require('body-parser').json());
    app.use(require('body-parser').urlencoded({
        extended: false
    }));
    app.use(require('express-session')({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    app.use(cookieParser());
    app.set('trust proxy', true);
    app.use(cors({
        origin: ALLOWED_ORIGINS,
        credentials: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/auth', authRouter);
    app.use('/connect', connectRouter);
    app.use('/weather', weatherRouter);
    app.use('/microsoft', microsoftRouter);
    app.use('/google', googleRouter);
    app.use('/twitch', twitchRouter);
    app.use('/spotify', spotifyRouter);
    app.use('/reddit', redditRouter);
    app.use('/user', userRouter);
    app.use('/users', usersRouter);
    app.get('/about.json', ((req, res) => {
        res.json({ client: { host: req.ip }, server: { current_time: moment().unix(), services: about.services } });
    }));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(port);
}

function connectToDb() {
    mongoose.connect(MONGO_URI, {
        user: MONGO_USER,
        pass: MONGO_PASSWORD,
        dbName: MONGO_DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        startServer();
    });
}

connectToDb();
