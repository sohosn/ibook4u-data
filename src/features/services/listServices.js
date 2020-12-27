/* eslint-disable no-console */
import { get as getFromDB } from '../../database';

async function listServices() {
  try {
    const response = await getFromDB(`config:services`);
    const { services } = response.content;
    return services;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default listServices;
