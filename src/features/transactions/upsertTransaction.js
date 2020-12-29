/* eslint-disable no-console */
import { upsert as updateDB } from '../../database';

function createTransactionEntry(option) {
  const {
    id,
    items,
    totalAmount,
    additional,
    discount,
    createdAt,
    apptDate,
    name,
    resourceName,
    deposit,
  } = option;

  const transactionItems = items.map((entry) => ({
    id: entry.id,
    name: entry.service,
    type: 'service',
    price: entry.price,
  }));

  const service = items.reduce((sum, entry) => sum + entry.price, 0);

  const entryTemplate = {
    id,
    items: transactionItems,
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
