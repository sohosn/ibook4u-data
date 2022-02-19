/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import moment from 'moment';
import { upsert as updateDB } from '../../database';
import api from '../index';
import getAndTouchServices from './common/services';

async function updateAppointment({
  id,
  name,
  mobile,
  resourceName,
  serviceIds,
  start,
  duration,
  totalAmount,
  additional,
  discount,
  toBeInformed,
  deposit,
}) {
  const now = moment();

  try {
    const appt = await api('getAppointment', { id });
    const { event } = appt;

    const services = await getAndTouchServices(serviceIds);

    const patchedEvent = await api('updateEvent', {
      event,
      apptId: id, // appointmentId
      name,
      start,
      mobile,
      // these services sent in are objects
      services,
      duration,
      resourceName,
      // these are sent in as floats
      totalAmount,
      additional,
      discount,
      informed: !!(
        toBeInformed === undefined ||
        toBeInformed === 'false' ||
        toBeInformed === false
      ), // bad logic too hard to understand //its set to false so that it will be picked up later to be informed
      deposit,
    });
    await updateDB(`event:${event.id}`, event);
    const patchedTransaction = await api('upsertTransaction', {
      id,
      items: services,
      totalAmount,
      additional,
      discount,
      now,
      apptDate: moment(start),
      name,
      resourceName,
      deposit,
    });

    const finalAppointmentObj = {
      id,
      eventId: event.id,
      transId: id,
      event: patchedEvent,
      transaction: patchedTransaction,
      createdAt: now,
      lastUpdated: now,
    };

    await updateDB(`appt:${id}`, finalAppointmentObj);
    return finalAppointmentObj;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default updateAppointment;
