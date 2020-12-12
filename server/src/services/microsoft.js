const iana = require('windows-iana/dist');
const microsoft = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const User = require('../models/User');
const moment = require('moment-timezone');

async function getUserDetails(accessToken) {
    const graphClient = getGraphClient(accessToken);
    return await graphClient
        .api('/me')
        .select('mailboxSettings')
        .get();
}

async function getCalendars(user, msalClient) {
    const accessToken = await getAccessToken(user, user.microsoftConnectData.homeAccountId, msalClient);
    const graphClient = getGraphClient(accessToken);
    const calendars = await graphClient.api('/me/calendars')
                                       .select('id,name')
                                       .top(25)
                                       .get();

    if (!calendars) {
        throw {
            expressRes: {
                message: 'cannot get events from calendars',
                code: 500
            }
        };
    }
    return calendars.value;
}

async function getEventByCalendar(user, calendarId, msalClient) {
    const accessToken = await getAccessToken(user, user.microsoftConnectData.homeAccountId, msalClient);
    const graphClient = getGraphClient(accessToken);
    const timeZoneId = iana.findOneIana(user.microsoftConnectData.timeZone);
    const todayBegin = moment.tz(timeZoneId.valueOf()).startOf('date').utc();
    const todayEnd = moment.tz(timeZoneId.valueOf()).endOf('date').utc();
    const events = await graphClient.api(`/me/calendars/${calendarId}/calendarView`)
                                    .header('Prefer', `outlook.timezone="${user.microsoftConnectData.timeZone}"`)
                                    .query({
                                        startDateTime: todayBegin.format(),
                                        endDateTime: todayEnd.format()
                                    })
                                    .select('subject,organizer,start,end')
                                    .orderby('start/dateTime')
                                    .top(25)
                                    .get();

    if (!events) {
        throw {
            expressRes: {
                message: `cannot get events from calendar ${calendarId}`,
                code: 500
            }
        };
    }
    return events.value;
}

async function getMailFolders(user, msalClient) {
    const accessToken = await getAccessToken(user, user.microsoftConnectData.homeAccountId, msalClient);
    const graphClient = getGraphClient(accessToken);
    const mailFolders = await graphClient.api('/me/mailFolders')
                                         .select('id,displayName,unreadItemCount')
                                         .get();

    if (!mailFolders) {
        throw {
            expressRes: {
                message: 'cannot get mail folders',
                code: 500
            }
        };
    }
    return mailFolders.value;
}

async function getMessagesByFolder(user, folderId, msalClient) {
    const accessToken = await getAccessToken(user, user.microsoftConnectData.homeAccountId, msalClient);
    const graphClient = getGraphClient(accessToken);
    const messages = await graphClient.api(`/me/mailFolders/${folderId}/messages`)
                                      .select('receivedDateTime,subject,isRead,sender,webLink')
                                      .top(10)
                                      .get();

    if (!messages) {
        throw {
            expressRes: {
                message: `cannot get messages from folder ${folderId}`,
                code: 500
            }
        };
    }
    return messages.value;
}

async function getAccessToken(user, userId, msalClient) {
    try {
        const accounts = await msalClient
            .getTokenCache()
            .getAllAccounts();
        const userAccount = accounts.find(account => account.homeAccountId === userId);
        const response = await msalClient.acquireTokenSilent({
            scopes: [ 'profile', 'openid', 'offline_access', 'email', 'Mail.Read', 'Calendars.Read', 'User.Read', 'MailboxSettings.Read' ],
            account: userAccount
        });
        return response.accessToken;
    } catch (err) {
        user.microsoftConnectData.isConnected = false;
        user.microsoftConnectData.homeAccountId = '';
        await User.updateOne({ email: user.email, isMicrosoftAuthed: user.isMicrosoftAuthed }, user);
        throw {
            expressRes: {
                message: 'cannot get new access token, please connect to Microsoft and try again',
                code: 403
            }
        };
    }
}

function getGraphClient(accessToken) {
    return microsoft.Client.init({
        authProvider: done => {
            done(null, accessToken);
        }
    });
}

module.exports = {
    getAccessToken,
    getUserDetails,
    getMailFolders,
    getMessagesByFolder,
    getCalendars,
    getEventByCalendar
};
