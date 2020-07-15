type Log = (message: string, metaData?: object, tags?: string[], topic?: string) => void;

export interface ILogger {
  info: Log;
  debug: Log;
  warn: Log;
  error: (message: string, error: Error, metaData?: object, tags?: string[], topic?: string) => void;
  log: Log;
}
