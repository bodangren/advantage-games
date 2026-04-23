import type { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

export const HEARTBEAT_INTERVAL = 30000;
export const HEARTBEAT_TIMEOUT = 90000;

interface ClientMetadata {
  isAlive: boolean;
}

export function createWebSocketServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws: WebSocket) => {
    const metadata: ClientMetadata = { isAlive: true };
    (ws as unknown as { metadata: ClientMetadata }).metadata = metadata;

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
    wss.clients.forEach((ws: WebSocket) => {
      const client = ws as unknown as { metadata?: ClientMetadata };
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
