import { GraphQLString as StringType } from 'graphql';
import AppointmentType from '../types/AppointmentType';
import api from '../../features';

export default {
  type: AppointmentType,
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    // console.log(`ARGS!!!!! ${args.id}`);
    return api('getAppointment', { id: args.id });
  },
};
