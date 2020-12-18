import { get as getFromDB } from '../../database';

export default async function get(options) {
  const { eventId } = options;
  // console.error(`options`, options);
  return getFromDB(`event:${eventId}`);
}
