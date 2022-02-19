/* eslint-disable no-console */
// import moment from 'moment';
import jwt from '../../utilities/jwt';
import { getConfig } from '../../utilities/configs';
import { byPersonCount as getAppointmentsCountByPerson } from '../persons/getPerson';
import contants from './common/constants';

const { generateCalendarObj } = jwt;
const calendarId = getConfig('calendar_id');

const { EDIT_URL, WHATSAPPURL } = contants;

async function patchHandler(event, options) {
  const {
    mobile,
    startDT,
    endDT,
    services,
    reminded,
    touchUpReminded,
    apptId,
    status,
    confirmed,
    shortURL,
    informed,
    totalAmount,
    deposit,
  } = options;

  const patchObject = {
    calendarId,
    eventId: event.id,
    // resource: event,
    requestBody: event,
  };

  const resource = patchObject.requestBody;

  let finalMobile = mobile;

  // magic number 8 Singapore
  if (mobile && mobile.length === 8) finalMobile = `65${mobile}`;

  if (startDT && endDT) resource.start.dateTime = startDT;
  if (endDT) resource.end.dateTime = endDT;

  if (resource.extendedProperties === undefined)
    resource.extendedProperties = {};
  if (resource.extendedProperties.shared === undefined)
    resource.extendedProperties.shared = {};

  if (finalMobile) resource.extendedProperties.shared.mobile = finalMobile;

  if (services) {
    resource.extendedProperties.shared.services = services
      .map((item) => item.id)
      .join(',');
    resource.description = `S($${services.reduce(
      (prevSum, item) => prevSum + item.price,
      0
    )})-T($${totalAmount})-D($${deposit})\n\n${services
      .map((item) => item.service)
      // eslint-disable-next-line prettier/prettier
      .join(
        ','
      )}\n\n${EDIT_URL}/${apptId}\n\n${WHATSAPPURL}/${finalMobile.replace(
      '+',
      ''
    )}`;

    const {
      count: countOfExistingAppointments,
    } = await getAppointmentsCountByPerson({
      id: resource.extendedProperties.shared.resourceName,
    });

    resource.summary = `${resource.attendees[0].displayName} (${
      countOfExistingAppointments > 0 ? countOfExistingAppointments : 'FIRST'
    }) - S($${services.reduce(
      (prevSum, item) => prevSum + item.price,
      0
    )})-T($${totalAmount})-D($${deposit})`;
  }
  if (reminded) {
    resource.extendedProperties.shared.reminded = reminded;
  }

  if (touchUpReminded) {
    resource.extendedProperties.shared.touchUpReminded = touchUpReminded;
  }

  resource.extendedProperties.shared.informed = informed;

  if (status) {
    resource.status = status;
  }

  if (apptId) {
    resource.extendedProperties.shared.uuid = apptId;
    resource.extendedProperties.shared.apptId = apptId;
  }

  if (shortURL) {
    resource.extendedProperties.shared.shortURL = shortURL;
  }

  if (confirmed) {
    if (resource.attendees && resource.attendees[0]) {
      resource.attendees[0].responseStatus = 'accepted';
    } else {
      console.error(`no attendees for calendar event -> ${event.id}`);
    }
    resource.extendedProperties.shared.confirmed = confirmed;
  }

  resource.extendedProperties.shared.changed = new Date().getTime();

  // patch update
  resource.sequence += 1;

  if (touchUpReminded || reminded) {
    console.error(`patchObject reminded =${JSON.stringify(patchObject)}`);
  }
  const calendar = await generateCalendarObj();
  return new Promise((res, rej) => {
    calendar.events.patch(patchObject, (err, response) => {
      if (err || !response) {
        console.error(
          '-------------------------------PATCH START-----------------------'
        );
        // eslint-disable-next-line no-unused-expressions
        err &&
          err.repsonse &&
          err.response.data &&
          err.response.data.error &&
          console.error(
            'Calendar Patch Response Error Message:',
            err.response.data.error.message
          );
        console.error(
          '-------------------------------PATCH END-----------------------'
        );
        return rej(err);
      }
      const { data: patchedEvent } = response;
      return res(patchedEvent);
    });
  });
}

export default function patch(options) {
  const { event } = options;

  if (!event) {
    return new Promise((_res, rej) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      rej('no event patched');
    });
  }

  return patchHandler(event, options);
}
