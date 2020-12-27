import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointment';
import event from './event';
import contact from './contact';
import contacts from './contacts';
import services from './services';
import getAppointmentsByPerson from './named/getAppointmentsByPerson';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    contact,
    contacts,
    event,
    services,
    // persons,
    // events,
    // person,
    // service,
    // product,
    // products,
    // slot,
    // slots,
    getAppointmentsByPerson,
  }),
});
module.exports = Query;
