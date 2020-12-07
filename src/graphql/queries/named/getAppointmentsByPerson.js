/* eslint-disable no-unused-vars */
import { GraphQLString as StringType, GraphQLInt as IntType } from 'graphql';
import PersonType from '../../types/PersonType';
import features from '../../../features/catalog';

const { getAppointmentsByPerson } = features;

// hardcode for 3 now
const getAppointmentsByPersonQuery = {
  type: PersonType,
  args: {
    id: { type: StringType },
    limit: { type: IntType },
  },
  async resolve(_obj, args /* , context not used */) {
    const { id, limit } = args;

    // const getAppointmentsByPerson = await api({
    //   action: 'getAppointmentsByPerson',
    //   id,
    //   limit,
    // });
    const appointments = await getAppointmentsByPerson(args);
    return appointments;
  },
};

export default getAppointmentsByPersonQuery;
