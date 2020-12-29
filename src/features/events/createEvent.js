/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
/* eslint-disable no-async-promise-executor */
import moment from 'moment';
import jwt from '../../utilities/jwt';
import { getConfig } from '../../utilities/configs';
import contants from './common/constants';
// TODO: fix

import { byPersonCount as getAppointmentsCountByPerson } from '../persons/getPerson';

const { generateCalendarObj } = jwt;
const calendarId = getConfig('calendar_id');

const { EDIT_URL, TEST_EMAIL, WHATSAPPURL } = contants;

function findExistingAppointments(calendar, options) {
  const { startDT, endDT } = options;

  return new Promise(async (res, rej) => {
    const timeMin =
      moment(startDT).add(1, 'seconds').toISOString() ||
      moment().subtract(2, 'hours').toISOString();
    const timeMax =
      endDT.toISOString() || moment().add(2, 'hours').toISOString();
    const finalOptions = {
      calendarId,
      timeMin,
      timeMax,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    };

    console.log(`findExistingAppointments finalOptions`, finalOptions);

    calendar.events.list(finalOptions, async (err, obj) => {
      if (err) {
        rej(err);
      } else {
        console.log('createEvent ', obj);
        res(obj.data.items);
      }
    });
  });
}

function createEvent(calendar, options) {
  const {
    uuid,
    name,
    mobile,
    startDT,
    endDT,
    services,
    resourceName,
    reminded,
    informed,
    totalAmount,
    deposit,
  } = options;

  return new Promise(async (res, rej) => {
    const {
      count: countOfExistingAppointments,
    } = await getAppointmentsCountByPerson({
      id: resourceName,
    });
    // const countOfExistingAppointments = 0;

    let finalMobile = mobile;

    // magic number 8 Singapore
    if (mobile && mobile.length === 8) finalMobile = `65${mobile}`;
    // FIRST logic can be better
    calendar.events.insert(
      {
        calendarId,
        resource: {
          start: {
            dateTime: startDT,
          },
          end: {
            dateTime: endDT,
          },
          summary: `${name} (${
            countOfExistingAppointments > 0
              ? countOfExistingAppointments
              : 'FIRST'
          }) - S($${services.reduce(
            (prevSum, item) => prevSum + item.price,
            0
          )})-T($${totalAmount})-D($${deposit})`,
          location: 'Home',
          status: 'tentative',
          extendedProperties: {
            shared: {
              mobile,
              reminded: reminded !== undefined ? reminded : false,
              informed: informed !== undefined ? informed : false,
              services: services.map((item) => item.id).join(','),
              uuid,
              resourceName,
            },
          },
          attendees: [
            {
              displayName: name,
              comment: mobile,
              email: TEST_EMAIL,
            },
          ],
          description: `S($${services.reduce(
            (prevSum, item) => prevSum + item.price,
            0
          )})-T($${totalAmount})-D($${deposit})\n\n${services
            .map((item) => item.service)
            .join(
              ','
            )}\n\n${EDIT_URL}/${uuid}\n\n${WHATSAPPURL}/${finalMobile.replace(
            '+',
            ''
          )}`,
        },
      },
      (err, { data: event }) => {
        if (err) {
          console.error(`Create Appointment Error: ${err}`);
          return rej(err);
        }
        // console.log(`event`, event);
        return res({
          event,
          uuid,
        });
      }
    );
  });
}

export default function create(options) {
  const { name, mobile, startDT, endDT, services, force, uuid } = options;

  console.error(options);

  // console.log(options);

  if (!name || !mobile || !startDT || !endDT || !services) {
    return new Promise((res, rej) => {
      rej('no event created');
    });
  }

  return new Promise(async (res, rej) => {
    try {
      const calendar = await generateCalendarObj();

      // console.log(`calendar`, calendar);

      if (!force) {
        const events = await findExistingAppointments(calendar, options);
        const filteredEvents = events.filter(
          (event) => event.summary.indexOf('-') !== 0
        );

        if (filteredEvents.length > 0) {
          console.error('------------Overlapping appointment 1---------------');
          console.error(JSON.stringify(events, null, 2));
          rej({
            error: 'Overlapping appointment',
          });
          return console.error(
            '--------Overlapping appointment 2-------------------'
          );
        }
      }

      const { event } = await createEvent(calendar, {
        sendUpdates: 'none',
        uuid,
        ...options,
      });
      return res(event);
    } catch (err) {
      console.error('calendar create', err, options);
      return rej('no event created in the end');
    }
  });
}
