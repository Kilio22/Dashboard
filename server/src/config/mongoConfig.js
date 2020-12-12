const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;

const MONGO_URI = `mongodb://${host}:${port}`;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DEFAULT;

module.exports = {
    MONGO_URI,
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_DB_NAME
};
