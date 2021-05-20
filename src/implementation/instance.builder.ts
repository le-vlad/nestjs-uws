import { ICreateServerArgs, ICreateServerSecureArgs } from 'src/interfaces/args.interface';
import * as UWS from 'uWebSockets.js';

export class UWSBuilder {
  static buildSSLApp(params: ICreateServerSecureArgs): UWS.TemplatedApp {
    return UWS.SSLApp({
      cert_file_name: params.sslCert,
      key_file_name: params.sslKey,
    });
  }

  static buildApp(params: ICreateServerArgs): UWS.TemplatedApp {
    return UWS.App();
  }
}