/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable no-console */
import moment from 'moment';
import functions from './catalog';

function processArguments(argv) {
  // console.log(argv.action);
  const options = argv;
  const startDT = argv.start ? moment(argv.start) : null;
  const endDT = argv.start
    ? moment(startDT).add(argv.duration, 'minutes')
    : null;

  return {
    ...options,
    startDT,
    endDT: argv.duration ? endDT : null,
    action: functions[argv.action] || functions.listEvents,
  };
}

// eslint-disable-next-line no-shadow
export default async function main(argv) {
  const options = processArguments(argv);
  const results = await options.action(options);
  return results;
}
