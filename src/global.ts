import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import jsonfile from 'jsonfile';
import { Pool } from 'pg';

import { config } from '../config';
import { createWinstonLogger, createLogger } from './libs/logger';
import { registerHandlers as registerProcessExceptionHandlers } from './libs/processExceptionHandlers';

const pkgJson = jsonfile.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'utf-8' });

// WARN:loggerFactory 方法使用地方比较多，所以最好在得到 config 后第一时间初始化
export const winstonLogger = createWinstonLogger(pkgJson, config.logging);
export const loggerFactory = (x: string) => createLogger(winstonLogger, x.replace(appRootPath.path, ''));

const logger = loggerFactory(__filename);
registerProcessExceptionHandlers(logger);

export const WriteFileOption: fs.BaseEncodingOptions = { encoding: 'utf-8' };
export const ReadFileOption: fs.BaseEncodingOptions = { encoding: 'utf-8' };

export const dbPool = new Pool(config.db);
dbPool.on('error', function (err: Error, client: any) {
  logger.error('dbPool error', new Error(JSON.stringify({ err, client }, null, 2)));
});
