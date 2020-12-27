import { get as getFromDB } from '../../database';

export default async function get(options) {
  const { id } = options;
  // console.error(`options`, options);
  return getFromDB(`event:${id}`);
}
