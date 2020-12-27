import { GraphQLString as StringType } from 'graphql';
import TransactionType from '../types/TransactionType';
import api from '../../features';

const transaction = {
  type: TransactionType,
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    const databaseObj = await api('getTransaction', { id: args.id });
    return databaseObj.value;
  },
};

export default transaction;
