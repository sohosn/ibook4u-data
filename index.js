/* eslint-disable no-console */
import express from 'express';
// const bodyParser = require("body-parser");
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import schema from './src/graphql/schema';
import auth from './src/utilities/auth';
import { getConstant } from './src/utilities/configs';

const app = express();
const DEV = process.env.ENV === 'dev';
// setting up middlewares
app.use(cors()); // TODO: add origin for the fontend
app.use(morgan('dev'));

if (!DEV) {
  app.use(auth);
}

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

if (DEV) {
  const token = jwt.sign(
    { username: 'admin', email: 'business@soho.sg' },
    getConstant('authSecret')
  );
  console.log(token);
}

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
