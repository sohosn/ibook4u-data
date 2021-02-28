/* eslint-disable no-console */
import Twilio from 'twilio';
import twilioKeys from '../../../configs/twilio.json';
import { getConfig } from '../../utilities/configs';

const defaultMobile = getConfig('mobile');
const client = new Twilio(twilioKeys.accountSid, twilioKeys.authToken);

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
  // sending SMS for now only
  // in the future EMAIL/SMS or both or telegram
  return sendSMS(options);
}

export default sendNotification;
