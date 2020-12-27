/* eslint-disable no-console */
import { getConfig } from './configs';

const { google } = require('googleapis');

const WORK_EMAIL = getConfig('work_email');
const CLIENT_EMAIL = getConfig('client_email');
const PRIVATE_KEY = getConfig('private_key');

// /* specifically for cache */
// let moduleToken = null;
let authClient = null;

function generateJWT(subject = null) {
  // eslint-disable-next-line consistent-return
  return new Promise((res, rej) => {
    if (authClient !== null) return res(authClient);
    authClient = new google.auth.JWT(
      CLIENT_EMAIL,
      null,
      PRIVATE_KEY,
      [
        'https://www.googleapis.com/auth/contacts',
        'https://www.googleapis.com/auth/calendar',
      ], // an array of auth scopes
      subject
    );
    authClient.authorize((err, token) => {
      if (err) {
        return rej(err);
      }
      console.error(token);
      authClient
        .on('tokens', (tokens) => {
          console.error(`tokens`, tokens);
        })
        .getAccessToken();
      return res(authClient);
    });
  });
}

async function generateCalendarObj() {
  let jwtClient = null;
  try {
    jwtClient = await generateJWT(WORK_EMAIL);
  } catch (err) {
    console.error('generateCalendarObj', err, WORK_EMAIL);
  }

  return google.calendar({
    version: 'v3',
    auth: jwtClient,
    timeout: 5000, // 5 seconds.
    retry: true,
    retryConfig: {
      onRetryAttempt: (retryError) => {
        console.error('retrying google calendar', retryError);
      },
    },
    ontimeout() {
      // Handle timeout.
      console.error(
        'gapi.client create waiting could not load in a timely manner!'
      );
    },
  });
}

async function generatePeopleObj() {
  let jwtClient = null;
  try {
    jwtClient = await generateJWT(WORK_EMAIL);
  } catch (err) {
    console.error('generateCalendarObj', err, WORK_EMAIL);
  }
  return google.people({
    version: 'v1',
    auth: jwtClient,
    timeout: 5000, // 5 seconds.
    retry: true,
    retryConfig: {
      onRetryAttempt: (retryError) => {
        console.error('retrying google people', retryError);
      },
    },
    ontimeout() {
      // Handle timeout.
      console.error(
        'gapi.client create waiting could not load in a timely manner!'
      );
    },
  });
}

export default {
  generateJWT,
  generateCalendarObj,
  generatePeopleObj,
};
