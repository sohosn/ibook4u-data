// ssh sohon -L 18091:172.17.0.1:18091 -L 18092:172.17.0.1:18092 -L 18093:172.17.0.1:18093 -L 18094:172.17.0.1:18094 -L 8094:172.17.0.1:8094 -L 8092:172.17.0.1:8092 -L 8091:172.17.0.1:8091 -L 11207:172.17.0.1:11207  -L 11210:172.17.0.1:11210 -L 8093:172.17.0.1:8093 -L 11211:172.17.0.1:11211
// https://www.npmjs.com/package/couchbase
/* eslint-disable no-console */
const couchbase = require('couchbase');
const config = require('../../config/config');

// console.log(config.couchbaseUrl);
const { url, username, password } = config.couchbase;
const cluster = new couchbase.Cluster(url, { username, password });
const bucket = cluster.bucket('default');
const coll = bucket.defaultCollection();
// bucket.enableN1ql([queryUrl]);

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
  const { id } = options;
  return new Promise((res, rej) => {
    coll.get(id, (err, result) => {
      if (err) {
        console.error(`Err getObject id=${options.id}`);
        // console.error(`getObject err`, err);
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

function deleteObject(options) {
  const { id } = options;
  return new Promise((res, rej) => {
    bucket.remove(id, (err, result) => {
      if (err) {
        console.error(`Err deleteObject id=${options.id}`);
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

function setObject(options) {
  const { id, doc } = options;
  return new Promise((res, rej) => {
    bucket.upsert(
      id,
      doc,
      {
        persist_to: 1,
      },
      (err, result) => {
        if (err) {
          console.error(`Err setObject id=${options.id}`);
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
  // console.log(id);
  // console.log(doc);
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
  // console.log(obj);
  return obj;
}

export async function remove(id) {
  const obj = await runOperation(deleteObject, {
    id,
  });
  return obj;
}

export async function query(queryString) {
  // https://developer.couchbase.com/documentation/server/4.1/sdks/node-2.0/n1ql-queries.html
  // console.log(`database/index queryString = ${queryString}`);
  const obj = await runOperation(queryOperation, {
    queryString,
  });
  return obj;
}

export default {
  upsert,
  get,
  remove,
  query,
};
