import _ from 'lodash';
import { MapLike } from 'typescript';

import { IHttpRequestLog } from './IHttpRequestLog';

/**
 * 微信网站应用用户登录信息
 */
export class HttpRequestLog implements IHttpRequestLog {
  public id: string;
  public serverName: string;
  public serverPort: number;
  public remoteAddr: string;
  public requestAt: Date;
  public requestMethod: string;
  public requestPath: string;
  public requestQuery?: MapLike<any>;
  public requestHeaders: MapLike<any>;
  public requestBody?: MapLike<any>;
  public responseAt: Date;
  public responseStatus: number;
  public responseHeaders: MapLike<any>;
  public responseBody?: MapLike<any>;
  public consumeMS?: number;
  public error?: MapLike<any>;
  public session?: MapLike<any>;
  public memo?: MapLike<any>;

  constructor(data: IHttpRequestLog) {
    this.id = data.id;
    this.serverName = data.serverName;
    this.serverPort = data.serverPort;
    this.remoteAddr = data.remoteAddr;

    // 请求信息
    this.requestAt = data.requestAt;
    this.requestMethod = data.requestMethod;
    this.requestPath = data.requestPath;
    this.requestQuery = data.requestQuery;
    this.requestHeaders = data.requestHeaders;
    this.requestBody = data.requestBody;

    // 返回信息
    this.responseAt = data.responseAt;
    this.responseStatus = data.responseStatus;
    this.responseHeaders = data.responseHeaders;
    this.responseBody = data.responseBody;

    this.consumeMS = data.responseAt.valueOf() - data.requestAt.valueOf();

    // 补充信息
    this.error = data.error;
    this.session = data.session;
    this.memo = data.memo;
  }
}
