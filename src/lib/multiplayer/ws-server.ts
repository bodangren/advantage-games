import type { Server } from 'http';
import type { WebSocketServer as WSServerType, WebSocket as WSType } from 'ws';

export const HEARTBEAT_INTERVAL = 30000;
export const HEARTBEAT_TIMEOUT = 90000;

interface ClientMetadata {
  isAlive: boolean;
}

export function createWebSocketServer(httpServer: Server): WSServerType {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ws = require('ws');
  const WSS = ws.WebSocketServer || ws.default?.WebSocketServer || ws.Server;
  const wss: WSServerType = new WSS({ server: httpServer });

  wss.on('connection', (ws: WSType) => {
    const metadata: ClientMetadata = { isAlive: true };
    (ws as any).metadata = metadata;

    ws.on('pong', () => {
      metadata.isAlive = true;
    });

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });

    ws.on('close', () => {
      // Client disconnected
    });
  });

  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: WSType) => {
      const client = ws as any;
      if (!client.metadata) {
        client.metadata = { isAlive: true };
      }

      if (!client.metadata.isAlive) {
        ws.terminate();
        return;
      }

      client.metadata.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  return wss;
}
