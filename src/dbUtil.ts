import { MapLike } from 'typescript';
import _ from 'lodash';

import { HttpRequestLog } from './libs/HttpRequestLog';
import { dbPool } from './global';

function convertToDBRow(dbRow: MapLike<any>) {
  const data: MapLike<any> = {};
  _.toPairs(dbRow).forEach(([k, v]) => {
    if (!_.isFunction(v)) {
      const key = _.snakeCase(k);
      data[key] = v;
    }
  });

  return data;
}

export async function insert2Db(log: HttpRequestLog) {
  const pairs = _.toPairs(convertToDBRow(log));
  const keys = pairs.map(x => x[0]);
  const values = pairs.map(x => x[1]);

  const cmd = `INSERT INTO "http_request_log"(${keys.map(x => `"${x}"`).join(',')}) VALUES(${keys.map((x, i) => `$${i + 1}`).join(',')});`;
  await dbPool.query(cmd, values);
}
