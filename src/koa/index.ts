import _ from 'lodash';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';

import { errorCatcher } from './middlewares/errorCatcher';
import { createCorsMW } from './middlewares/cors';
import { HttpRequestLog } from '../libs/HttpRequestLog';
import { insert2Db } from '../dbUtil';

export const router = new Router({ prefix: '/log' });
router.post('/', async (ctx, next) => {
  if (!_.isObject(ctx.request.body) || _.isEmpty(ctx.request.body)) {
    ctx.throw(415, 'UnsupportedMediaType');
  }
  await insert2Db(ctx.request.body as HttpRequestLog).catch(err => {
    if (err.constraint === 'http_request_log_pkey') {
      ctx.throw(422, `Duplicate http_request_log_pkey ${ctx.request.body.id}`);
    } else {
      ctx.throw(415, err.message);
    }
  });

  ctx.status = 204;
});

export function registerHandlers(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  const accessDomainRegExpArray = [/.*/i];
  const crosIgnoreValidate: string[] = [];

  app.use(errorCatcher);
  app.use(createCorsMW(accessDomainRegExpArray, crosIgnoreValidate));
  app.use(koaBody());
  app.use(router.routes()).use(router.allowedMethods());
}
