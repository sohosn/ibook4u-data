/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable no-console */
import moment from 'moment';
import functions from './catalog';

function processArguments(action, argv = {}) {
  // console.log(`FEATURES processArguments action = ${action}`);
  const options = argv;
  const startDT = argv.start ? moment(argv.start) : null;
  const endDT = argv.start
    ? moment(startDT).add(argv.duration, 'minutes')
    : null;

  return {
    ...options,
    startDT,
    endDT: argv.duration ? endDT : null,
    action: functions[action] || functions.listEvents,
  };
}

// eslint-disable-next-line no-shadow
export default async function main(action, argv) {
  const options = processArguments(action, argv);
  console.log(`FEATURES options`, options);
  const results = await functions[action](options);
  return results;
}
