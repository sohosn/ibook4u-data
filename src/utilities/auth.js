/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { getConstant } from './configs';

module.exports = async (req, _res, next) => {
  // check for token in headers

  if (req.method === 'GET' && req.url === '/graphql') {
    next();
  }

  const AUTH_SECRET = getConstant('authSecret');
  const TOKEN = req.headers.authorization;
  console.log(`config.secret ${AUTH_SECRET}`);
  console.log(`token ${TOKEN}`);
  try {
    const { username } = await jwt.verify(TOKEN, AUTH_SECRET);
    // asign the user to req.user
    req.user = username;
    next();
  } catch (err) {
    console.log(err);
  }
};
