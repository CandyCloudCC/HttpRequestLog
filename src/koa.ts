import { Pool } from 'pg';
import _ from 'lodash';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { HttpError } from 'http-errors';
import { MapLike } from 'typescript';

import { config } from '../config';

const dbPool = new Pool(config.db);
dbPool.on('error', function (err: Error, client: any) {
  console.error('dbPool error', new Error(JSON.stringify({ err, client }, null, 2)));
});

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

function errorCatcher(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) {
  return next().catch((err: Error) => {
    if (err instanceof HttpError) {
      ctx.status = err.statusCode;
      ctx.body = err.message;
      return;
    }

    ctx.status = 500;
    ctx.body = 'InternalServerError';
  });
}

async function insert2Db(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) {
  if (!_.isObject(ctx.request.body) || _.isEmpty(ctx.request.body)) {
    ctx.throw(415, 'UnsupportedMediaType');
  }

  const pairs = _.toPairs(convertToDBRow(ctx.request.body));
  const keys = pairs.map(x => x[0]);
  const values = pairs.map(x => x[1]);

  const cmd = `INSERT INTO "http_request_log"(${keys.map(x => `"${x}"`).join(',')}) VALUES(${keys.map((x, i) => `$${i + 1}`).join(',')});`;
  await dbPool.query(cmd, values);
  ctx.status = 204;
}

export const router = new Router({ prefix: '/log' });
router.post('/', insert2Db);

export function registerHandlers(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  app.use(errorCatcher);
  app.use(koaBody());
  app.use(router.routes()).use(router.allowedMethods());
}
