export interface ICreateServerArgs {
  port: number;
}

export interface ICreateServerSecureArgs {
  port: number;
  sslKey: string;
  sslCert: string;
}

export interface ICreateServerOptionsArgs {
  isSSL: boolean;
  port: number;
  sslKey?: string;
  sslCert?: string;
}
