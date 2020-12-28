import configs from './keys/google.json';

const context = {
  calendarId: 'test',
};
export function get(key) {
  return configs[key];
}

export function getContext(key) {
  return context[key];
}

export default {
  get,
  getContext,
};
