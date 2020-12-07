import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointmentQuery';
import getAppointmentsByPerson from './named/getAppointmentsByPerson';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    getAppointmentsByPerson,
    // updateAppointment,
    // cancelAppointment,
    // updateEventStatus,
    // refreshContacts,
  }),
});
module.exports = Query;
