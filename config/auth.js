/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = async (req, _res, next) => {
  // check for token in headers

  if (req.method === 'GET' && req.url === '/graphql') {
    next();
  }
  const token = req.headers.authorization;
  console.log(`config.secret ${config.secret}`);
  console.log(`token ${token}`);
  try {
    const { username } = await jwt.verify(token, config.secret);
    // asign the user to req.user
    req.user = username;
    next();
  } catch (err) {
    console.log(err);
  }
};
