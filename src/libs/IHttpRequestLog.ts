import { MapLike } from 'typescript';

export interface IHttpRequestLog {
  id: string;
  serverName: string;
  serverPort: number;
  remoteAddr: string;
  requestAt: Date;
  requestMethod: string;
  requestPath: string;
  requestQuery?: MapLike<any>;
  requestHeaders: MapLike<any>;
  requestBody?: MapLike<any>;
  responseAt: Date;
  responseStatus: number;
  responseHeaders: MapLike<any>;
  responseBody?: MapLike<any>;
  /**
   * 消耗毫秒数
   */
  consumeMS?: number;
  /**
   * 异常信息
   */
  error?: MapLike<any>;
  /**
   * 用户 session
   */
  session?: MapLike<any>;
  /**
   * 备忘信息
   */
  memo?: MapLike<any>;
}
