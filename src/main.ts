import _ from 'lodash';
import Koa from 'koa';

import { config } from '../config';
import './global';
import { registerHandlers as registerKoaHandlers } from './koa';

const app = new Koa();
const originalErrorHandler = app.onerror;
app.onerror = (err: Error) => {
  console.error('koa error', err);
  originalErrorHandler.call(app, err);
};

async function main() {
  registerKoaHandlers(app);
  app.listen(config.port);
}

main();
