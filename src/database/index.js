// ssh sohon -L 18091:172.17.0.1:18091 -L 18092:172.17.0.1:18092 -L 18093:172.17.0.1:18093 -L 18094:172.17.0.1:18094 -L 11207:172.17.0.1:11207
// ssh sohon -L 19091:172.17.0.1:18091 -L 19092:172.17.0.1:18092 -L 19093:172.17.0.1:18093 -L 19094:172.17.0.1:18094 -L 19207:172.17.0.1:11207
// ssh sohon -L 11207:172.17.0.1:11207 -L 11210:172.17.0.1:11210 -L 8093:172.17.0.1:8093 -L 8092:172.17.0.1:8092 -L 8091:172.17.0.1:8091
// ssh sohon -L 18091:172.17.0.1:18091 -L 18092:172.17.0.1:18092 -L 18093:172.17.0.1:18093 -L 18094:172.17.0.1:18094 -L 8094:172.17.0.1:8094 -L 9092:172.17.0.1:8092 -L 9091:172.17.0.1:8091 -L 11207:172.17.0.1:11207  -L 11210:172.17.0.1:11210 -L 8093:172.17.0.1:8093 -L 11211:172.17.0.1:11211
// https://www.npmjs.com/package/couchbase
// https://docs.couchbase.com/nodejs-sdk/current/howtos/managing-connections.html
/* eslint-disable no-console */
const couchbase = require('couchbase');
const config = require('../../config/config');

// console.log(config.couchbaseUrl);
const { url, username, password } = config.couchbase;

console.log(config.couchbase);
const cluster = new couchbase.Cluster(url, { username, password });
const bucket = cluster.bucket('default');
const coll = bucket.defaultCollection();

const tenantPrefix = config.tenant ? `${config.tenant}:` : '';

async function runOperation(operation, options) {
  let res = null;
  try {
    res = await operation(options);
  } catch (err) {
    // console.error(`runOperation=${JSON.stringify(err)}`);
    res = null;
    throw err;
  }
  // bucket.disconnect();
  return res;
}

function getObject(options) {
  const objId = tenantPrefix + options.id;
  return new Promise((res) => {
    coll.get(objId, (err, result) => {
      if (err) {
        console.error(`Err getObject id=${objId}`);
        // console.error(`getObject err`, err);
        res({});
      } else {
        res(result);
      }
    });
  });
}

function deleteObject(options) {
  const objId = tenantPrefix + options.id;
  return new Promise((res, rej) => {
    bucket.remove(objId, (err, result) => {
      if (err) {
        console.error(`Err deleteObject id=${objId}`);
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

function setObject(options) {
  const objId = tenantPrefix + options.id;
  return new Promise((res, rej) => {
    bucket.upsert(
      objId,
      options.doc,
      {
        persist_to: 1,
      },
      (err, result) => {
        if (err) {
          console.error(`Err setObject id=${objId}`);
          rej(err);
        } else {
          res(result);
        }
      }
    );
  });
}

function queryOperation(options) {
  const { queryString } = options;

  //  https://docs.couchbase.com/server/5.5/performance/index-scans.html

  return new Promise((res, rej) => {
    cluster.query(queryString, (err, rows) => {
      if (err) {
        // console.error(`Err queryOperation n1Query=${queryString}`);
        rej(err);
      } else {
        // console.log(`rows = ${JSON.stringify(rows, null, 2)}`);
        res(rows);
      }
    });
  });
}

export async function upsert(id, doc) {
  const obj = await runOperation(setObject, {
    id,
    doc,
  });
  return obj;
}

export async function get(id) {
  const obj = await runOperation(getObject, {
    id,
  });
  return obj;
}

export async function remove(id) {
  const obj = await runOperation(deleteObject, {
    id,
  });
  return obj;
}

export async function query(queryString) {
  // https://blog.couchbase.com/scopes-and-collections-for-modern-multi-tenant-applications-couchbase-7-0/
  // https://developer.couchbase.com/documentation/server/4.1/sdks/node-2.0/n1ql-queries.html
  // console.log(`database/index queryString = ${queryString}`);
  try {
    const obj = await runOperation(queryOperation, {
      queryString,
    });
    return obj;
  } catch (couchbaseError) {
    console.error(couchbaseError);
  }
  return null;
}

export default {
  upsert,
  get,
  remove,
  query,
};
