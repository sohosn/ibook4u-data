/* eslint-disable no-console */
import couchbase from 'couchbase';
import config from '../../configs/constants';

const { couchbaseUrl, username, password } = config;

console.log(JSON.stringify(config, null, 2));

const cluster = new couchbase.Cluster(couchbaseUrl, { username, password });

const bucket = cluster.bucket('default');
const coll = bucket.defaultCollection();

coll.upsert('testdoc', { name: 'Frank' }, (err) => {
  if (err) throw err;

  coll.get('testdoc', (_err, res) => {
    if (_err) throw _err;

    console.log('Final=', res.value);
    // {name: Frank}
  });
});
