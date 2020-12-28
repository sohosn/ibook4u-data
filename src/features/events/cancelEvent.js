import jwt from '../../utilities/jwt';
import { getContext } from '../../../config/index';
import googleKeys from '../../../config/keys/google.json'; // TO REMOVE

const { generateCalendarObj } = jwt;
const calendarId = getContext('calendarId') || googleKeys.calendar_id;

export default function deleteEvent(options) {
  return new Promise((res, rej) => {
    const { eventId } = options;
    generateCalendarObj().then((calendar) => {
      calendar.events.delete(
        {
          calendarId,
          eventId,
        },
        async (err, response) => {
          if (err) {
            rej(err);
          } else {
            res(response);
          }
        }
      );
    });
  });
}
