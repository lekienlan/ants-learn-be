import type { IncomingMessage, Server, ServerResponse } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

const connectedClients: WebSocket[] = [];

export const sendWSMessage = (type: string, data?: Object) => {
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
};

export default (
  expressServer: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const wss = new WebSocketServer({ noServer: true, path: '/websocket' });

  expressServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit('connection', websocket, request);
    });
  });
  wss.on('connection', function connection(ws) {
    connectedClients.push(ws);
    console.log('Websocket connected');

    ws.on('message', (message) => {
      console.log('Websocket message: ', message);
    });

    ws.on('error', (error) => {
      console.error('WebSocket Server Error: ', error.message);
    });

    sendWSMessage('connected to websocket!!!');
  });

  return wss;
};
