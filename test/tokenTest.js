/* eslint-disable no-console */
import jwt from 'jsonwebtoken';

const config = {
  secret: 'myraresecret',
};
async function test() {
  const token = jwt.sign(
    { username: 'admin', email: 'business@soho.sg' },
    config.secret
  );
  const { username } = await jwt.verify(token, config.secret);
  console.log(token);
  console.log(username);
}

test();
