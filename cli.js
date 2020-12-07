/* eslint-disable no-console */
import { argv } from 'yargs';
import main from './main';

try {
  main(argv);
} catch (err) {
  console.log(`running err=${JSON.stringify(err, null, 2)}`);
}
