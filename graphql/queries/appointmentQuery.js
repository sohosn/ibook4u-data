import { GraphQLString as StringType } from 'graphql';
import appointmentType from '../types/appointmentType';
// import { get } from '../database';

const appointment = {
  type: appointmentType,
  args: {
    id: { type: StringType },
  },
  async resolve(obj, args) {
    // const event = await get(`event:${args.id}`);

    return { status: true };
  },
};

export default appointment;
