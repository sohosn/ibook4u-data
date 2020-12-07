import moment from 'moment';
import functions from './catalog';

console.log(Object.keys(functions));

const defaultFunction = functions.listEvents;

function processArguments(argv) {
  const options = argv;
  const startDT = moment(argv.start);
  const endDT = moment(startDT).add(argv.duration, 'minutes');

  return {
    ...options,
    startDT: startDT.toISOString(),
    endDT: argv.duration ? endDT.toISOString() : null,
    action: functions[argv.action] || defaultFunction,
  };
}

// eslint-disable-next-line no-shadow
export default async function main(argv) {
  const options = processArguments(argv);
  const results = await options.action(options);
  return results;
}
