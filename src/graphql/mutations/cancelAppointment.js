import {
  GraphQLString as StringType,
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
    by: {
      // by customer or admin
      type: StringType,
    },
    toBeInformed: {
      type: BooleanType,
    },
  },
  async resolve(_value, { id, by, toBeInformed }) {
    return api('cancelAppointment', { id, by, toBeInformed });
  },
};
