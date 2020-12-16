import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointment';
import event from './event';
import getAppointmentsByPerson from './named/getAppointmentsByPerson';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    // persons,
    event,
    // events,
    // person,
    // service,
    // services,
    // product,
    // products,
    // slot,
    // slots,
    getAppointmentsByPerson,
  }),
});
module.exports = Query;
