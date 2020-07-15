import _ from 'lodash';

import { ILogger } from './ILogger';

let registed = false;

export function registerHandlers(logger: ILogger) {
  if (registed) {
    return;
  }

  process.on('uncaughtException', err => {
    logger.error(`process uncaughtException`, err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    let err = new Error(`process unhandledRejection`);
    let meta = '';
    if (reason instanceof Error) {
      err = reason;
    } else {
      meta = String(reason).toString();
    }

    logger.error(`process unhandledRejection`, err, _.isEmpty(meta) ? undefined : { reason: meta });
  });

  process.on('multipleResolves', (type, promise, value) => {
    logger.error(`process multipleResolves`, new Error(`process multipleResolves`), { type, value });
  });

  registed = true;
}
