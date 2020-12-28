import configs from '../../configs/google.json';
import constants from '../../configs/constants';

export function getConfig(key) {
  return configs[key];
}

export function getConstant(key) {
  return constants[key];
}

export function getContext(key) {
  if (key === 'calendar_id') {
    return configs[key];
  }
  return null;
}

export default {
  getConfig,
  getConstant,
  getContext,
};
