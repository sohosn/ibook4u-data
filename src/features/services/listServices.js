/* eslint-disable no-console */
import { get as getFromDB } from '../../database';

async function listServices() {
  try {
    const response = await getFromDB(`config:services`);
    // console.log('listservices response', response.content);
    const { services } = response.content;
    return services.filter((x) => x !== null);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default listServices;
