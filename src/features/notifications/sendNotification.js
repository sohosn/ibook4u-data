/* eslint-disable no-console */
const Twilio = require('twilio');
const keys = require('../../../config/keys/twilio.json');
const configs = require('../../../config/config');

const defaultMobile = configs.get('mobile');
const client = new Twilio(keys.accountSid, keys.authToken);

const FROM = 'RareBeauty';
const REPLY_MOBILE = defaultMobile;
const TEST_MOBILE = defaultMobile;

export function sendSMS(options) {
  const { test, message } = options;
  const finalMessage = message.replace('REPLY_MOBILE', REPLY_MOBILE);
  let { mobile } = options;

  mobile = mobile.replace(/\s/g, '');

  if (mobile.length >= 8) {
    mobile = mobile
      .split('')
      .reverse()
      .join('')
      .substring(0, 8)
      .split('')
      .reverse()
      .join('');
  }

  if (!mobile.startsWith('+65')) {
    mobile = `+65${mobile}`;
  }

  if (test) {
    mobile = TEST_MOBILE;
  }

  if (mobile.length === 11) {
    // console.log(mobile);
    return client.messages.create({
      body: finalMessage,
      to: mobile,
      from: FROM,
    });
  }
  return console.error(`invalid mobile number=${mobile}`);
}

async function sendNotification(options) {
  return sendSMS(options);
}

export default sendNotification;
