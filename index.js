/* eslint-disable no-console */
import express from 'express';
// const bodyParser = require("body-parser");
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import schema from './src/graphql/schema';
import auth from './config/auth';
import config from './config/config';

const app = express();

// setting up middlewares
app.use(cors()); // TODO: add origin for the fontend
app.use(morgan('dev'));
app.use(auth);

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

if (process.env.ENV === 'dev') {
  const token = jwt.sign(
    { username: 'admin', email: 'business@soho.sg' },
    config.secret
  );
  console.log(token);
}

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
