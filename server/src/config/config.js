const FRONT_PORT = process.env.FRONT_PORT || '4200';
const FRONT_BASE_URI = `http://localhost:${FRONT_PORT}`;

const ALLOWED_ORIGINS = [
    FRONT_BASE_URI,
    `http://localhost:4200`
];

if (FRONT_PORT === '80')
    ALLOWED_ORIGINS.push('http://localhost');

module.exports = {
    ALLOWED_ORIGINS,
    FRONT_BASE_URI
};
