/* eslint-disable no-console */
import express from 'express';
import 'regenerator-runtime/runtime';
// const bodyParser = require("body-parser");
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import schema from './graphql/schema';
import auth from './utilities/auth';
import { getConstant } from './utilities/configs';

const app = express();
const DEV = process.env.ENV === 'dev';

// setting up middlewares
app.use(cors()); // TODO: add origin for the fontend
app.use(morgan('dev'));

app.use(auth);

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const AUTH_SECRET = getConstant('authSecret');
    const TOKEN = req.headers.authorization;
    const { user, tenant } = await jwt.verify(TOKEN, AUTH_SECRET);
    // console.log('{ tenant, user }',user + ' ' + tenant);
    return { user, tenant };
  }
});
server.applyMiddleware({ app });

if (DEV) {
  const token = jwt.sign(
    { user: 'admin', tenant: 'SOHO' },
    getConstant('authSecret')
  );
  console.log(token);
} else {
  /* IN LIVE, it will be populated by NGINX USER LIST */
}

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
