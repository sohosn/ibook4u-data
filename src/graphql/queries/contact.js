import { GraphQLString as StringType } from 'graphql';
// import fetch from 'isomorphic-fetch';
import ContactType from '../types/ContactType';
import api from '../../features';

const contact = {
  type: ContactType,
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    const { id } = args;
    return api('getContact', { id });
  },
};

export default contact;
