import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import EventType from './EventType';
import TransactionType from './TransactionType';
import event from '../queries/event';
import transaction from '../queries/transaction';

const AppointmentType = new ObjectType({
  name: 'Appointment',
  fields: {
    id: { type: StringType },
    event: {
      type: EventType,
      async resolve(obj) {
        return event.resolve(obj, { id: obj.eventId });
      },
    },
    transaction: {
      type: TransactionType,
      async resolve(obj) {
        return transaction.resolve(obj, { id: obj.transId });
      },
    },
    // transactions: { type: new ListType(StringType) },
    createdAt: { type: new NonNull(StringType) },
    lastUpdated: { type: new NonNull(StringType) },
  },
});

export default AppointmentType;
