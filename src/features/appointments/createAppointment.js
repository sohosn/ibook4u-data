/* eslint-disable import/no-cycle */
/* eslint-disable no-console */

import moment from 'moment';
import { v1 as uuidv1 } from 'uuid';
import { upsert as updateDB } from '../../database';
import api from '../index';
import getAndTouchServices from './common/services';
import willBeReminded from './common/phone';
import sendNotification from '../notifications/sendNotification';
import { createShortURL } from '../utilities/shortURL';

const COMPANY_NAME = 'Rare Beauty';

async function createAppointment({
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
  force,
}) {
  let finalResourceName = resourceName;
  const now = moment();
  const uuid = uuidv1();

  // NEW CUSTOMER FLOW
  if (
    resourceName === '' ||
    resourceName === undefined ||
    resourceName === null
  ) {
    // find by mobile first before creating
    const firstLast = name.split(' ');
    const first = firstLast[0];
    const last = firstLast[1] || '';
    const res = await api('createContact', {
      first,
      last,
      mobile,
    });
    finalResourceName = res.resourceName;
  }

  try {
    const services = await getAndTouchServices(serviceIds);

    const sendReminded = await willBeReminded(finalResourceName);

    const event = await api('createEvent', {
      uuid,
      name,
      start,
      mobile,
      // these services sent in are objects
      services,
      duration,
      resourceName: finalResourceName,
      // these are sent in as floats not actually needed
      totalAmount,
      additional,
      discount,
      reminded: sendReminded,
      informed: !!(
        toBeInformed === undefined ||
        toBeInformed === 'false' ||
        toBeInformed === false
      ), // bad logic
      deposit,
      force,
    });

    await updateDB(`event:${event.id}`, event);

    const transaction = await api('upsertTransaction', {
      id: uuid,
      items: services, // include products in future
      totalAmount,
      additional,
      discount,
      now,
      apptDate: moment(start),
      name,
      resourceName,
      deposit,
    });

    const shortURL = await createShortURL({ id: uuid });
    const finalAppointmentObj = {
      id: uuid,
      eventId: event.id,
      transId: uuid,
      event,
      shortURL,
      transaction,
      createdAt: now,
      lastUpdated: now,
    };
    await updateDB(`appt:${uuid}`, finalAppointmentObj);

    /* Start Sending Message */
    const startDate = moment(event.start.dateTime).format('DD-MMM');
    const startTime = moment(event.start.dateTime).format('hh:mm a');
    const message = `Your appt with ${COMPANY_NAME} on ${startDate} at ${startTime} is reserved.\n\nClick ${shortURL.id} to view address/details`;

    console.error(`message=${message}`);
    sendNotification({ message, mobile });
    /* End Sending Message */

    return finalAppointmentObj;
  } catch (err) {
    // this is scenario to rollback when appointment cannot be created.
    // remove contact
    if (
      (resourceName === '' || resourceName === undefined) &&
      finalResourceName
    ) {
      await api({
        action: 'deleteContact',
        resourceName: finalResourceName,
      });
    }
    console.error(err);
    throw err;
  }
}

export default createAppointment;
