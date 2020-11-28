import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointmentQuery';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    // createWaitingAppointment,
    // updateAppointment,
    // cancelAppointment,
    // updateEventStatus,
    // refreshContacts,
  }),
});
module.exports = Query;
