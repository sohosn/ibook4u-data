import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointment';
import event from './event';
import events from './events';
import contact from './contact';
import contacts from './contacts';
import services from './services';
import person from './person';
import slots from './slots';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    contact,
    contacts,
    event,
    services,
    person,
    events,
    slots,
    // persons,
    // service,
    // product,
    // products,
  }),
});
export default Query;
