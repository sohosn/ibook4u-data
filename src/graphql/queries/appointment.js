import { GraphQLString as StringType } from 'graphql';
import AppointmentType from '../types/AppointmentType';
import api from '../../features';

export default {
  type: AppointmentType,
  args: {
    id: { type: StringType },
  },
  async resolve(_, args, context) {
    // console.log(`ARGS!!!!! ${args.id}`);
    // console.log('context', context);
    return api('getAppointment', { id: args.id }, context);
  },
};
