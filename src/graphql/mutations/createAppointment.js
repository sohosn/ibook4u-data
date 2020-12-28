/* eslint-disable no-console */
import {
  //   GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import AppointmentType from '../types/AppointmentType';
import api from '../../features';

const createAppointment = {
  type: AppointmentType,
  args: {
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
    toBeInformed: {
      type: BooleanType,
    },
    deposit: {
      type: FloatType,
    },
    force: {
      type: BooleanType,
    },
    waitingList: {
      type: BooleanType,
    },
  },
  async resolve(_, args) {
    return api('createAppointment', args);
  },
};

export default createAppointment;
