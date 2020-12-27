/* eslint-disable no-console */
import AST from 'auto-sorting-array';
import {
  //   GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import moment from 'moment';
import AppointmentType from '../types/AppointmentType';
import api from '../../features';

function createTransactionEntry(
  uuid,
  entries,
  totalAmount,
  additional,
  discount,
  createdAt,
  apptDate,
  name,
  resourceName,
  deposit
) {
  const items = entries.map((entry) => ({
    id: entry.id,
    name: entry.service,
    type: 'service',
    price: entry.price,
  }));

  const service = entries.reduce((sum, entry) => sum + entry.price, 0);

  const entryTemplate = {
    id: uuid,
    items,
    totalAmount,
    service,
    product: 0,
    additional,
    discount,
    createdAt,
    apptDate,
    name,
    resourceName,
    deposit,
  };
  return entryTemplate;
}

const createAppointment = {
  type: AppointmentType,
  args: {
    name: {
      type: StringType,
    },
    start: {
      type: StringType,
    },
    mobile: {
      type: StringType,
    },
    serviceIds: {
      type: new ListType(StringType),
    },
    duration: {
      type: IntegerType,
    },
    resourceName: {
      type: StringType,
    },
    totalAmount: {
      type: FloatType,
    },
    additional: {
      type: FloatType,
    },
    discount: {
      type: FloatType,
    },
    toBeInformed: {
      type: BooleanType,
    },
    deposit: {
      type: FloatType,
    },
    force: {
      type: BooleanType,
    },
    waitingList: {
      type: BooleanType,
    },
  },
  async resolve(
    _,
    {
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
      // waitingList,
    }
  ) {
    let finalResourceName = resourceName;
    // console.log(`services=${services}`);

    if (
      resourceName === '' ||
      resourceName === undefined ||
      resourceName === null
    ) {
      // find by mobile first before creating

      const firstLast = name.split(' ');
      const first = firstLast[0];
      const last = firstLast[1] || '';
      // console.log(`first=${first} last = ${last}`);
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
      // console.log('createAppointment.js listOfServices', listOfServices);
      const astServices = new AST(listOfServices, 'id');

      const services = serviceIds.map((serviceId) =>
        // console.log(`serviceId=${serviceId}`);
        astServices.getByKey(serviceId)
      );
      // console.error('i was here');
      // console.error(services);
      // console.error(astServices.getArray());

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

      const now = moment();
      // create event vs waiting list
      // if (waitingList) {
      //   const { event, uuid } = await api({
      //     action: 'createWaitingEvent',
      //     name,
      //     start,
      //     mobile,
      //     // these services sent in are objects
      //     services,
      //     duration,
      //     resourceName: finalResourceName,
      //     // these are sent in as floats not actually needed
      //     totalAmount,
      //     additional,
      //     discount,
      //     reminded,
      //     informed: !!(
      //       toBeInformed === undefined ||
      //       toBeInformed === 'false' ||
      //       toBeInformed === false
      //     ), // bad logic
      //     deposit,
      //     force: true,
      //   });
      //   return {
      //     id: uuid,
      //     event,
      //     transaction: {},
      //     createdAt: now,
      //     lastUpdated: now,
      //   };
      // }
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
      await api('createAppointment', {
        id: uuid,
        eventId: event.id,
        transId: uuid,
        createdAt: now,
        lastUpdated: now,
      });
      const transaction = createTransactionEntry(
        uuid,
        services,
        totalAmount,
        additional,
        discount,
        now,
        moment(event.start.dateTime),
        name,
        resourceName,
        deposit
      );
      await api('createTransaction', transaction);
      // console.log(`uuid=${uuid}`);
      // console.log(`transaction=${JSON.stringify(transaction, null, 2)}`);
      return { id: uuid, event, transaction, createdAt: now, lastUpdated: now };
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
  },
};

export default createAppointment;
