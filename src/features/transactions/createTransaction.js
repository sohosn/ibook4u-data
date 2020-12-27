/* eslint-disable no-console */
import { upsert as updateDB } from '../../database';

async function createTransaction(input) {
  // TODO: to do some validation
  try {
    const { id } = input;
    await updateDB(`trans:${id}`, input);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default createTransaction;
