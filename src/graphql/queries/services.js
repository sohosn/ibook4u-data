import { GraphQLList as ListType } from 'graphql';
import ServiceType from '../types/ServiceType';
import api from '../../features';

const services = {
  type: new ListType(ServiceType),
  async resolve() {
    return api('listServices');
  },
};

export default services;
