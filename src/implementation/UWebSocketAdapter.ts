import { WebSocketAdapter } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { ICreateServerArgs, ICreateServerOptionsArgs, ICreateServerSecureArgs } from '../interfaces';

import * as UWS from 'uWebSockets.js';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import * as events from 'events';

export class UWebSocketAdapter implements WebSocketAdapter {
  private instanceConfiguration: ICreateServerArgs | ICreateServerSecureArgs = null;
  private instance: UWS.TemplatedApp = null;
  private listenSocket: string = null;

  constructor(args: ICreateServerArgs | ICreateServerSecureArgs) {
    this.instanceConfiguration = args;
    this.instance = UWS.App();
  }

  bindClientConnect(server: UWS.TemplatedApp, callback: Function): any {
    this.instance.ws('/*', {
      open: (socket) => {
        Object.defineProperty(socket, 'emitter', {
          configurable: false,
          value: new events.EventEmitter(),
        });
        callback(socket);
      },
      message: (socket, message, isBinary) => {
        socket['emitter'].emit('message', { message, isBinary });
      },
    }).any('/*', (res, req) => {
      res.end('Nothing to see here!');
    });
  }

  bindMessageHandlers(client: UWS.WebSocket, handlers: MessageMappingProperties[], process: (data: any) => Observable<any>): any {
    fromEvent(client['emitter'], 'message')
      .pipe(
        mergeMap((data: { message: ArrayBuffer, isBinary: boolean }) => this.bindMessageHandler(data, handlers, process)),
        filter(result => result),
      )
      .subscribe(response => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer: { message: ArrayBuffer, isBinary: boolean },
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    const stringMessageData = Buffer.from(buffer.message).toString('utf-8');
    const message = JSON.parse(stringMessageData);
    const messageHandler = handlers.find(
      handler => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }

    return process(messageHandler.callback(message.data));
  }

  close(server: UWS.TemplatedApp): any {
    UWS.us_listen_socket_close(server);
    this.instance = null;
  }

  async create(port: number, options?: ICreateServerOptionsArgs): Promise<any> {
    return new Promise((resolve, reject) => this.instance.listen(port, (token) => {
      if (token) {
        this.listenSocket = token;
        resolve(this.instance);
      } else {
        reject('Can\'t start listening...');
      }
    }));
  }
}
