/* eslint-disable no-console */
import moment from 'moment';
import { upsert as upsertDB } from '../../database';
import api from '../index';

async function cancelAppointment({ id, by, toBeInformed }) {
  try {
    const appt = api('getAppointment', { id });
    const { event, eventId, transaction } = appt;

    const now = moment();
    await upsertDB(`cancel:${id}`, {
      canceledAt: now,
      id,
      by: by || 'customer',
      event,
      transaction,
    });

    await api({
      action: 'cancelEvent',
      eventId,
      apptId: id,
      informed: !!(
        toBeInformed === undefined ||
        toBeInformed === 'false' ||
        toBeInformed === false
      ), // bad logic too hard to understand //its set to false so that it will be picked up later to be informed
    });
    // console.log(`fullEvent:${JSON.stringify(event)}`);

    return { id };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default cancelAppointment;
