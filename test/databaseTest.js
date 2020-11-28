/* eslint-disable no-console */
import couchbase from 'couchbase';
import config from '../config/config';

const { url, username, password } = config.couchbase;

const cluster = new couchbase.Cluster(url, { username, password });

const bucket = cluster.bucket('default');
const coll = bucket.defaultCollection();

coll.upsert('testdoc', { name: 'Frank' }, (err) => {
  if (err) throw err;

  coll.get('testdoc', (_err, res) => {
    if (_err) throw _err;

    console.log(res.value);
    // {name: Frank}
  });
});
