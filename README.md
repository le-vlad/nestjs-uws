<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
  
  <a href="https://github.com/uNetworking/uWebSockets.js" target="_blank">
      <img src="https://raw.githubusercontent.com/uNetworking/uWebSockets/master/misc/logo.svg" width="100" alt="Nest Logo" />
    </a>
</div>

<h3 align="center">NestJS uWebSocket.js gateway adapter</h3>

<div align="center">
  <img src="https://github.com/heavenlyteam/nestjs-uws/workflows/Build/badge.svg" alt="">
</div>

### Installation

```bash
npm i nestjs-uws
```

### Usage

```typescript
import { UWebSocketAdapter } from 'nestjs-uws';

const app = await NestFactory.create(ApplicationModule);
app.useWebSocketAdapter(new UWebSocketAdapter({
  port: 8099,
}));
```

You can't create SSL secure APP for now. You will need to use reverse-proxy to hide the websocket server behind.

### Options

UWS Adapter options

| Name  | Type  |
|---|---|
|port|number|

## Packet structure

To use the NestJS WebSocket gateway decorators you should implement the base packet structure
and send any messages from the client using the next structure

```javascript
{
    "event": String,
    "data": any
}
``` 
