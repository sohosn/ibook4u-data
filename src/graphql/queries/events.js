import moment from 'moment';
import { GraphQLList as ListType, GraphQLString as StringType } from 'graphql';
import EventType from '../types/EventType';
import api from '../../features';

const events = {
  type: new ListType(EventType),
  args: {
    id: { type: StringType },
  },
  async resolve(_obj, args) {
    const rows = await api('listEvents', {
      ...args,
      start: moment(),
      end: moment().add(2, 'days'),
    });
    const eventList = [];
    rows.forEach((row) => {
      eventList[eventList.length] = row.event;
    });
    return eventList;
  },
};

export default events;
