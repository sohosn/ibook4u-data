import jwt from '../../utilities/jwt';
import { getContext } from '../../utilities/configs';

const { generateCalendarObj } = jwt;

export default function cancelEvent(options) {
  return new Promise((res, rej) => {
    const { eventId } = options;
    const calendarId = getContext('calendar_id');
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
