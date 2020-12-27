import configs from '../../config/keys/google.json';

export function getConfig(key) {
  return configs[key];
}

export default {
  getConfig,
};
