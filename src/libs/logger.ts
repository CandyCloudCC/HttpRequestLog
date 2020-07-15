import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { MapLike } from 'typescript';
import winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import Transport from 'winston-transport';

import { momentTZ } from './momentTZ';
import { ILogger } from './ILogger';

export function createWinstonLogger(pkgJson: MapLike<any>, options: MapLike<any>) {
  const transports: Transport[] = [];
  /**
   * Console transporter
   */
  if (options.console.enabled) {
    transports.push(
      new winston.transports.Console({
        level: options.console.level,
        handleExceptions: options.console.handleExceptions
      })
    );
  }

  /**
   * File transporter
   */
  if (options.file.enabled) {
    // Create logs directory
    const logDir = options.file.path;
    if (!fs.existsSync(logDir)) {
      throw new Error(`File log base directory "${logDir}" is not exists`);
    }

    transports.push(
      new WinstonDailyRotateFile({
        filename: path.join(logDir, `${pkgJson.name}.v${pkgJson.version}.m_${process.env.NODE_ENV}.info.%DATE%.log`),
        level: 'info',
        handleExceptions: true
      })
    );

    transports.push(
      new WinstonDailyRotateFile({
        filename: path.join(logDir, `${pkgJson.name}.v${pkgJson.version}.m_${process.env.NODE_ENV}.exceptions.%DATE%.log`),
        level: 'warn',
        handleExceptions: true
      })
    );
  }

  transports.forEach(x => x.setMaxListeners(10000));

  const winstonLogger = winston.createLogger({
    level: 'info',
    transports,
    exitOnError: false
  });

  return winstonLogger;
}

function loggingProxy(winstonLogger: winston.Logger, moduleName: string, level: string, message: string, error?: Error, metadata?: string | object, tags?: string[], topic?: string) {
  const log: MapLike<any> = {
    timeStamp: momentTZ.format('YYYY-MM-DD HH:mm:ss.SSS[+08]'),
    message,
    module: moduleName,
    topic: topic || `runtime_${level}`
  };

  if (error) {
    log.error = error.stack || error.message;
  }
  if (metadata) {
    log.metadata = metadata;
  }
  if (tags && tags.length > 0) {
    log.tags = tags;
  }
  (winstonLogger as MapLike<any>)[level](log);
}

export function createLogger(winstonLogger: winston.Logger, moduleName = ''): ILogger {
  return {
    info: (message: string, metaData?: object, tags?: string[], topic?: string) => {
      loggingProxy(winstonLogger, moduleName, 'info', message, undefined, metaData, tags, topic);
    },
    debug: (message: string, metaData?: object, tags?: string[], topic?: string) => {
      loggingProxy(winstonLogger, moduleName, 'debug', message, undefined, metaData, tags, topic);
    },
    warn: (message: string, metaData?: object, tags?: string[], topic?: string) => {
      loggingProxy(winstonLogger, moduleName, 'warn', message, undefined, metaData, tags, topic);
    },
    error: (message: string, error: Error, metaData?: object, tags?: string[], topic?: string) => {
      loggingProxy(winstonLogger, moduleName, 'error', message, error, metaData, tags, topic);
    },
    log: (message: string, metaData?: object, tags?: string[], topic?: string) => {
      loggingProxy(winstonLogger, moduleName, 'log', message, undefined, metaData, tags, topic);
    }
  };
}
