const couchbase = require('couchbase');
const config = require('../../constants');

const { couchbaseUrl, username, password } = config;

console.log(JSON.stringify(config, null, 2));
const url =
  //  'couchbase://192.168.86.195:11207?network=external&ssl=no_verify&console_log_level=10';
  'couchbase://192.168.86.195:11207?network=external&ssl=no_verify&console_log_level=10';
// const url = 'couchbase://172.17.0.4';
// const url = 'couchbase://192.168.86.195';
// const cluster = new couchbase.Cluster('couchbase://172.17.0.1=http?network=external&ssl=no_verify&console_log_level=5', { username, password });
console.log(url);

const cluster = new couchbase.Cluster(url, { username, password });

const bucket = cluster.bucket('default');
const coll = bucket.defaultCollection();

coll.upsert('testdoc', { name: 'Frank' }, (err) => {
  if (err) console.log(JSON.stringify(err, null, 2));

  coll.get('testdoc', (_err, res) => {
    if (_err) console.log(_err);

    console.log('Final=', res.value);
    // {name: Frank}
  });
});
