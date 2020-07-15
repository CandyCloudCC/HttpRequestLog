import Koa from 'koa';
import _ from 'lodash';
import { URL } from 'url';

export function createCorsMW(accessDomainRegExpArray: RegExp[], ignoreValidate: string[]) {
  accessDomainRegExpArray = accessDomainRegExpArray.map(x => new RegExp(x, 'i'));

  return function cors(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) {
    // 公众号通知和订单消息回调没有 referer & origin 不需要进行 CORS 校验,具体的校验工作交给对应的处理函数进行签名加密校验
    if (ignoreValidate.includes(ctx.path)) {
      return next();
    }

    if (ctx.path === '/swagger.json') {
      ctx.request.headers['x-usage'] = 'api';
    }

    if (ctx.request.method.toUpperCase() !== 'OPTIONS' && (ctx.request.headers['x-usage'] || '').toLowerCase() !== 'api') {
      ctx.status = 404;
      ctx.body = 'NotFound';
      return;
    }

    const origin = new URL(ctx.header.referer || ctx.header.origin || 'http://192.168.1.1');
    if (accessDomainRegExpArray.some(x => x.test(origin.host))) {
      ctx.set('Access-Control-Allow-Origin', origin.origin);
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Vary', 'Origin');
    } else {
      return ctx.throw(406, 'NotAcceptable');
    }

    if (ctx.request.method.toUpperCase() !== 'OPTIONS') {
      return next();
    }

    const requestHeaders = ctx.header['access-control-request-headers'];
    if (requestHeaders) {
      ctx.set('Access-Control-Allow-Headers', requestHeaders);
    }
    const requestMethod = ctx.header['access-control-request-method'];
    if (requestMethod) {
      ctx.set('Access-Control-Allow-Methods', requestMethod);
    }
    ctx.set('Access-Control-Max-Age', '-1');

    ctx.status = 200;
  };
}
