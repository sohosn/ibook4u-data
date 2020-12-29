import { GraphQLObjectType as ObjectType } from 'graphql';

import createAppointment from './createAppointment';
// import createWaitingAppointment from './CreateWaitingAppointment';
import updateAppointment from './updateAppointment';
import cancelAppointment from './cancelAppointment';
// import updateEventStatus from './UpdateEventStatus';
import refreshContacts from './refreshContacts';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: () => ({
    createAppointment,
    cancelAppointment,
    refreshContacts,
    updateAppointment,
    // createWaitingAppointment,
    // updateEventStatus,
    // refreshContacts,
  }),
});

module.exports = Mutation;
