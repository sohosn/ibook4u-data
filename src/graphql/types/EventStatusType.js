import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  // GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
  // GraphQLFloat as FloatType,
  // GraphQLList as ListType,
} from 'graphql';

const EventStatusType = new ObjectType({
  name: 'EventStatus',
  fields: {
    id: {
      type: new NonNull(StringType),
      resolve(obj) {
        return obj.id;
      },
    },
    status: {
      type: new NonNull(StringType),
      resolve(obj) {
        return obj.status;
      },
    },
  },
});

export default EventStatusType;
