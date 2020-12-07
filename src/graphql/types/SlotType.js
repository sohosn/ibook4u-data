import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const FREE_TYPE = 'Free';

const SlotType = new ObjectType({
  name: 'Slot',
  fields: {
    start: {
      type: new NonNull(StringType),
      resolve(obj) {
        return obj.start;
      },
    },
    end: {
      type: new NonNull(StringType),
      resolve(obj) {
        return obj.end;
      },
    },
    durationInMinutes: {
      type: new NonNull(IntegerType),
      resolve(obj) {
        return obj.durationInMinutes;
      },
    },
    type: {
      type: new NonNull(StringType),
      resolve() {
        return FREE_TYPE;
      },
    },
    amp: {
      type: new NonNull(StringType),
      resolve(obj) {
        return obj.amp;
      },
    },
  },
});

export default SlotType;
