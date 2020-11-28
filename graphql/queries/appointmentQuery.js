import { GraphQLString as StringType } from 'graphql';
import AppointmentType from '../types/AppointmentType';

module.exports = {
  type: AppointmentType,
  args: {
    id: { type: StringType },
  },
  async resolve(obj, args, context) {
    // const dbObj = await get(`appt:${args.id}`);
    // console.log(JSON.stringify(dbObj.value));
    return { test: true }; //dbObj.value;
  },
};
