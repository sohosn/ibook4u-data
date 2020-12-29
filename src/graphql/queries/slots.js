import { GraphQLList as ListType, GraphQLString as StringType } from 'graphql';
// import moment from 'moment';
import SlotType from '../types/SlotType';
import api from '../../features';

const slots = {
  type: new ListType(SlotType),
  args: {
    type: { type: StringType },
  },
  async resolve(_, args) {
    // TODO Validation
    return api('listSlots', { type: args.type });
  },
};

export default slots;
