import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
} from 'graphql';

const ItemType = new ObjectType({
  name: 'Item',
  fields: {
    id: {
      type: new NonNull(StringType),
    },
    type: {
      type: new NonNull(StringType),
    },
    name: {
      type: new NonNull(StringType),
    },
    price: {
      type: new NonNull(FloatType),
    },
  },
});

export default ItemType;
