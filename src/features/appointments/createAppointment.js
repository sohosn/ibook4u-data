/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import AST from 'auto-sorting-array';
import moment from 'moment';

import { upsert as updateDB } from '../../database';
import api from '../index';

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
    /* need to abstract this logic */
    const listOfServices = await api('listServices');
    const astServices = new AST(listOfServices, 'id');
    const services = serviceIds.map((serviceId) =>
      astServices.getByKey(serviceId)
    );
    api('updateServices', astServices.getArray());
    /* end of abstraction */

    let reminded = false;

    // get finalResourceName here
    const person = await api('getContact', {
      id: finalResourceName,
    });
    const userDefined = person && person.userDefined;
    if (userDefined) {
      const validPhoneArray = userDefined.filter(
        (obj) => obj.key === 'validPhone'
      );
      // this is the business logic
      /* i think we must check the whole array */
      reminded = validPhoneArray[0] && validPhoneArray[0].value === 'false';
    }

    const { event, uuid } = await api('createEvent', {
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
      reminded,
      informed: !!(
        toBeInformed === undefined ||
        toBeInformed === 'false' ||
        toBeInformed === false
      ), // bad logic
      deposit,
      force,
    });

    const transaction = await api('createTransaction', {
      uuid,
      services,
      totalAmount,
      additional,
      discount,
      now,
      apptDate: moment(start),
      name,
      resourceName,
      deposit,
    });
    // console.log(`uuid=${uuid}`);
    // console.log(`transaction=${JSON.stringify(transaction, null, 2)}`);
    const finalObj = {
      id: uuid,
      event,
      transaction,
      createdAt: now,
      lastUpdated: now,
    };
    await updateDB(`appt:${uuid}`, finalObj);
    return finalObj;
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
