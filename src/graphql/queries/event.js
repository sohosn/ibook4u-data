import { GraphQLString as StringType } from 'graphql';
import EventType from '../types/EventType';
import { getEvent } from '../../features/catalog';

const events = {
  type: EventType,
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    const databaseObj = getEvent({ eventId: args.id });
    return databaseObj.value;
  },
};

export default events;
