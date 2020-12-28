/* eslint-disable no-console */
import { upsert as updateDB } from '../../database';

function createTransactionEntry(option) {
  const {
    uuid,
    entries,
    totalAmount,
    additional,
    discount,
    createdAt,
    apptDate,
    name,
    resourceName,
    deposit,
  } = option;

  const items = entries.map((entry) => ({
    id: entry.id,
    name: entry.service,
    type: 'service',
    price: entry.price,
  }));

  const service = entries.reduce((sum, entry) => sum + entry.price, 0);

  const entryTemplate = {
    id: uuid,
    items,
    totalAmount,
    service,
    product: 0,
    additional,
    discount,
    createdAt,
    apptDate,
    name,
    resourceName,
    deposit,
  };
  return entryTemplate;
}

async function createTransaction(input) {
  const transaction = createTransactionEntry(input);
  try {
    const { id } = input;
    await updateDB(`trans:${id}`, transaction);
    return transaction;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default createTransaction;
