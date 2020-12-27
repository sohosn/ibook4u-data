/* eslint-disable no-console */
import { upsert as updateDB } from '../../database';

async function updateServices(services) {
  // TODO: to do some validation

  try {
    await updateDB(`config:services`, { services: Object.values(services) });
    return services;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default updateServices;
