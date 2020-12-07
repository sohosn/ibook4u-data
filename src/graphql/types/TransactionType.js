import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
  GraphQLList as ListType,
} from 'graphql';

import ItemType from './ItemType';

const TransactionType = new ObjectType({
  name: 'Transaction',
  fields: {
    id: {
      type: new NonNull(StringType),
    },
    items: {
      type: new ListType(ItemType),
    },
    totalAmount: {
      type: new NonNull(FloatType),
    },
    service: {
      type: new NonNull(FloatType),
    },
    product: {
      type: new NonNull(FloatType),
    },
    discount: {
      type: new NonNull(FloatType),
    },
    additional: {
      type: new NonNull(FloatType),
    },
    createdAt: {
      type: new NonNull(StringType),
    },
    deposit: {
      type: new NonNull(FloatType),
    },
  },
});

export default TransactionType;
