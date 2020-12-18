import moment from 'moment';
import { query } from '../../database';

/* to list all calendar events between a period of time */
export default async function list(options) {
  const {
    calendarId,
    timeStart,
    startDT,
    endDT,
    orderBy,
    maxResults,
  } = options;

  const timeMin = timeStart || startDT || moment().subtract(3, 'hours');
  const finalOptions = {
    calendarId,
    timeMin,
    timeMax: endDT || moment(),
    maxResults: maxResults || 2000,
    singleEvents: true,
    orderBy: orderBy || 'startTime',
  };

  const queryString = `select * from default event 
    where STR_TO_MILLIS(event.\`start\`.\`dateTime\`) 
     BETWEEN ${finalOptions.timeMin.valueOf()} AND ${finalOptions.timeMax.valueOf()}
    ORDER BY \`start\`.\`dateTime\` desc LIMIT 5`;

  // console.log(`queryString = ${queryString}`);
  const objs = await query(queryString);

  // .then((idObjs) => {
  //   try {
  //     let totalCancelledLess36 = -1;
  //     if (idObjs.length === 1) {
  //       totalCancelledLess36 = idObjs[0].totalCancelledLess36;
  //     }
  //     res({
  //       id,
  //       cancelledAppointmentsCount: totalCancelledLess36,
  //     });
  //   } catch (err) {
  //     console.error(`Error byPerson=${JSON.stringify(err)}`);
  //     rej(err);
  //   }
  return objs.rows;

  // console.log(`finalOptions=${JSON.stringify(finalOptions, null, 2)}`);
}
