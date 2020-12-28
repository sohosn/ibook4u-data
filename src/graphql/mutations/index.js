import { GraphQLObjectType as ObjectType } from 'graphql';

import createAppointment from './createAppointment';
// import createWaitingAppointment from './CreateWaitingAppointment';
// import updateAppointment from './UpdateAppointment';
import cancelAppointment from './cancelAppointment';
// import updateEventStatus from './UpdateEventStatus';
// import refreshContacts from './RefreshContacts';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: () => ({
    createAppointment,
    cancelAppointment,
    // createWaitingAppointment,
    // updateAppointment,
    // updateEventStatus,
    // refreshContacts,
  }),
});

module.exports = Mutation;
