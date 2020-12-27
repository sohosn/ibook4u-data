/* eslint-disable no-continue */
/* eslint-disable no-console */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import main from './src/features';

function println(events) {
  if (events.length === 0) {
    console.log('No changed events found.');
  } else {
    console.log(`Upcoming events (${events.length}):`);
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      if (event.summary && event.summary.indexOf('-') === 0) continue;
      if (event.start) {
        const start = event.start.dateTime || event.start.date;
        const description =
          (event.description && event.description.split('\n')[0]) ||
          'No Description';
        console.log(
          '%s - %s - %s - %s - %s - %s -%s',
          start,
          event.summary,
          event.status,
          event.id,
          description,
          (event.extendedProperties &&
            event.extendedProperties.shared &&
            event.extendedProperties.shared.services) ||
            'no services',
          (event.extendedProperties &&
            event.extendedProperties.shared &&
            event.extendedProperties.shared.mobile) ||
            '0',
          (event.extendedProperties &&
            event.extendedProperties.shared &&
            event.extendedProperties.shared.reminded) ||
            'false',
          (event.extendedProperties &&
            event.extendedProperties.shared &&
            event.extendedProperties.shared.touchUpReminded) ||
            'false'
        );
      } else {
        console.error(event);
      }
    }
  }
}

try {
  const { argv } = yargs(hideBin(process.argv));
  console.log(`Command is ${argv.action}`);
  main(argv.action, argv).then((results) => {
    if (results && Array.isArray(results)) {
      if (results.length > 0 && argv.details) {
        if (results[0].start) {
          println(results);
        } else {
          console.log('Array Results:', JSON.stringify(results, null, 2));
        }
        console.log(`Results Length ${results.length}`);
      } else if (argv.pretty) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log(`Results is ${results}`);
      }
    } else {
      console.log('Results:', JSON.stringify(results, null, 2));
    }
    process.exit(); // to kill couchbase bucket
  });
} catch (err) {
  console.log(`running err=${JSON.stringify(err, null, 2)}`);
}
