/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { getConstant } from './configs';

export default async (req, _res, next) => {
  // check for token in headers

  if (req.method === 'GET' && req.url === '/graphql') {
    next();
  }

  const AUTH_SECRET = getConstant('authSecret');
  const TOKEN = req.headers.authorization;
  // console.log(`config.secret ${AUTH_SECRET}`);
  // console.log(`token ${TOKEN}`);
  try {
    const { user, tenant } = await jwt.verify(TOKEN, AUTH_SECRET);
    // asign the user to req.user
    // console.log('user, tenant ', user + ' ' + tenant);
    req.user = user;
    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Auth Error', err);
  }
};
