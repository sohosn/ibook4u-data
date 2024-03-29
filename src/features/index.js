/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
/* eslint-disable no-console */
import moment from 'moment';
import functions from './catalog';

function processArguments(action, argv = {}, context) {
  // console.log(`FEATURES processArguments action = ${action}`);
  const options = argv;
  const startDT = argv.start ? moment(argv.start) : null;  
  const user = context && context.user || 'UNKNOWN';
  const tenant  = context && context.tenant || 'UNKNOWN';
  const endDT =
    argv.duration && argv.start
      ? moment(startDT).add(argv.duration, 'minutes')
      : argv.end;

  return {
    ...options,
    startDT,
    user,
    tenant,
    endDT: endDT || null,
    action: functions[action] || functions.listEvents,
  };
}

// eslint-disable-next-line no-shadow
export default async function main(action, argv, context) {
  const options = processArguments(action, argv, context);
  console.log(`FEATURES action`, action);
  // console.log(`FEATURES functions`, Object.keys(functions));
  console.log(`FEATURES options`, JSON.stringify(options, null, 2));
  const results = await functions[action](options);
  return results;
}
