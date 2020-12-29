import { GraphQLString as StringType } from 'graphql';
import ResponseType from '../types/ResponseType';
import api from '../../features';

export default {
  type: ResponseType,
  args: {
    refresh: {
      type: StringType,
    },
  },
  async resolve() {
    try {
      await api('listContacts', { forceRefresh: true });
      return { id: 0, code: 'refreshed' };
    } catch (err) {
      return { id: -1, code: 'error refreshing' };
    }
  },
};
