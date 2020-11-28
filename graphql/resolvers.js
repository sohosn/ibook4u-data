const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello World!!';
    },
  },
  Mutation: {
    async createUser(root, args, { DB }) {
      const { username, email, password } = args;
      //const user = await DB.User.createUser(email, username, password);
      //return user;
      return args;
    },
    async login(root, args, { DB }) {
      const { email, password } = args;
      //const user = await DB.User.auth(email, password);
      //return user;
      return args;
    },
  },
};

module.exports = resolvers;
