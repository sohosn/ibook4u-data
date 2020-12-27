/* eslint-disable no-console */
import { upsert as updateDB } from '../../database';

async function createAppointment(input) {
  // TODO: to do some validation
  try {
    const { id } = input;
    await updateDB(`appt:${id}`, input);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default createAppointment;
