import {
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import AppointmentType from '../types/AppointmentType';
import api from '../../features';

export default {
  type: AppointmentType,
  args: {
    id: {
      type: StringType,
    },
    name: {
      type: StringType,
    },
    start: {
      type: StringType,
    },
    mobile: {
      type: StringType,
    },
    serviceIds: {
      type: new ListType(StringType),
    },
    duration: {
      type: IntegerType,
    },
    resourceName: {
      type: StringType,
    },
    totalAmount: {
      type: FloatType,
    },
    additional: {
      type: FloatType,
    },
    discount: {
      type: FloatType,
    },
    deposit: {
      type: FloatType,
    },
    toBeInformed: {
      type: BooleanType,
    },
  },
  async resolve(_, args) {
    return api('updateAppointment', args);
  },
};
