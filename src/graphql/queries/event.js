import { GraphQLString as StringType } from 'graphql';
import EventType from '../types/EventType';
import api from '../../features';

const events = {
  type: EventType,
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    const databaseObj = await api('event', { eventId: args.id });
    return databaseObj.value;
  },
};

export default events;
