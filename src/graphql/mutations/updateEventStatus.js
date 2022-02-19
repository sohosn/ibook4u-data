import {
    GraphQLString as StringType,
  } from 'graphql';
  import EventStatusType from '../types/EventStatusType';
  import api from '../../features';
  
  export default {
    type: EventStatusType,
    args: {
      id: {
        type: StringType,
      },
      status: {
        type: StringType,
      },
    },
    async resolve(_ , args) {
      /* TO BE REVISITED */
      return api('updateEvent', args);      
    },
  };
  