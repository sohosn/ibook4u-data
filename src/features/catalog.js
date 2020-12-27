/* eslint-disable import/prefer-default-export */
// https://stackoverflow.com/questions/38340500/export-multiple-classes-in-es6-modules

// Basic explanation to prevent any confusions

// An Appointment consist associations of a calendar event and a transaction
// An Event is specifically created to model the data structure of a calendar event for separation of concerns. You should always start from an appointment not an event
import getAppointmentsByPerson from './appointments/getAppointmentsByPerson';
import getEvent from './events/getEvent';
import listEvents from './events/listEvents';
import listServices from './services/listServices';

export default {
  getAppointmentsByPerson,
  getEvent,
  listEvents,
  listServices,
};
