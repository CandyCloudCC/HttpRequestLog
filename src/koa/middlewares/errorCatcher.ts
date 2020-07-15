import Koa from 'koa';
import { MapLike } from 'typescript';

export function errorCatcher(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) {
  return next().catch((err: MapLike<any>) => {
    ctx.error = err;
    if (err.statusCode !== undefined) {
      ctx.status = err.statusCode;
      ctx.body = err.message;
      return;
    }

    ctx.status = 500;
    ctx.body = 'InternalServerError';
  });
}
