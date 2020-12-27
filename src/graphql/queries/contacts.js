import { GraphQLList as List } from 'graphql';
// import fetch from 'isomorphic-fetch';
import ContactType from '../types/ContactType';
import api from '../../features';

const contacts = {
  type: new List(ContactType),
  async resolve() {
    // console.log('graphql listContacts');

    const data = await api('getContact');
    return data;
  },
};

export default contacts;
