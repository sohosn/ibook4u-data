import { GraphQLString as StringType } from 'graphql';
import appointmentType from '../types/AppointmentType';
import { get } from '../../database';

export default {
  type: appointmentType,
  args: {
    id: { type: StringType },
  },
  async resolve(obj, args) {
    // console.log(`ARGS!!!!! ${args.id}`);
    const databaseObj = await get(`event:${args.id}`);
    // console.log(databaseObj);
    return databaseObj.content;
  },
};