const AZURE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const AZURE_AUTHORITY = 'YOUR_AZURE_AUTHORITY_URL_HERE'; // for exemple: https://login.microsoftonline.com/common/
const AZURE_ISSUER = 'https://login.microsoftonline.com/{YOUR_TENANT_ID_HERE}/v2.0';
const AZURE_CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';

module.exports = {
    AZURE_ISSUER,
    AZURE_CLIENT_ID,
    AZURE_AUTHORITY,
    AZURE_CLIENT_SECRET
};
