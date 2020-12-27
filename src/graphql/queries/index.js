import { GraphQLObjectType as ObjectType } from 'graphql';

import appointment from './appointment';
import event from './event';
import contact from './contact';
import contacts from './contacts';
import services from './services';
import person from './person';

const Query = new ObjectType({
  name: 'Query',
  fields: () => ({
    appointment,
    contact,
    contacts,
    event,
    services,
    person,
    // persons,
    // events,
    // service,
    // product,
    // products,
    // slot,
    // slots,
  }),
});
module.exports = Query;
