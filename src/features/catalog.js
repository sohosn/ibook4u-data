/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
// https://stackoverflow.com/questions/38340500/export-multiple-classes-in-es6-modules

// Basic explanation to prevent any confusions

// An Appointment consist associations of a calendar event and a transaction
// An Event is specifically created to model the data structure of a calendar event for separation of concerns. You should always start from an appointment not an event
import getAppointmentsByPerson from './appointments/getAppointmentsByPerson';
import getEvent from './events/getEvent';
import createEvent from './events/createEvent';
import listEvents from './events/listEvents';
import listServices from './services/listServices';
import listContacts from './contacts/listContacts';
import getContact from './contacts/getContact';
import getPerson from './persons/getPerson';
import getTransaction from './transactions/getTransaction';
import updateServices from './services/updateServices';
import createAppointment from './appointments/createAppointment';
import cancelAppointment from './appointments/cancelAppointment';
import getAppointment from './appointments/getAppointment';
import updateAppointment from './appointments/updateAppointment';
import upsertTransaction from './transactions/upsertTransaction';
import cancelEvent from './events/cancelEvent';
import patchEvent from './events/patchEvent';
import listSlots from './slots/listSlots';

export default {
  getAppointmentsByPerson,
  getEvent,
  listEvents,
  listServices,
  listContacts,
  getContact,
  getPerson,
  getTransaction,
  updateServices,
  createAppointment,
  upsertTransaction,
  createEvent,
  getAppointment,
  cancelAppointment,
  cancelEvent,
  listSlots,
  patchEvent,
  updateAppointment,
};
