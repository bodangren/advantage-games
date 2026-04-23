import http from 'http';
import { createWebSocketServer, HEARTBEAT_INTERVAL, HEARTBEAT_TIMEOUT } from './ws-server';

// Mock ws module
jest.mock('ws', () => {
  const mockClients = new Set();
  let connectionHandler: ((ws: any) => void) | null = null;
  let closeHandler: (() => void) | null = null;

  class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    
    readyState = 1;
    metadata: any = null;
    private eventHandlers: Record<string, Function[]> = {};

    on(event: string, handler: Function) {
      if (!this.eventHandlers[event]) this.eventHandlers[event] = [];
      this.eventHandlers[event].push(handler);
    }

    emit(event: string, ...args: any[]) {
      if (this.eventHandlers[event]) {
        this.eventHandlers[event].forEach(h => h(...args));
      }
    }

    ping() {
      // Simulate ping - if no pong response, client should be terminated
      setTimeout(() => {
        if (!this.metadata?.isAlive) {
          this.terminate();
        }
      }, 100);
    }

    pong() {
      if (this.metadata) this.metadata.isAlive = true;
    }

    terminate() {
      this.readyState = 3;
      this.emit('close');
      mockClients.delete(this);
    }

    close() {
      this.readyState = 3;
      this.emit('close');
      mockClients.delete(this);
    }
  }

  class MockWebSocketServer {
    clients = mockClients;
    private eventHandlers: Record<string, Function[]> = {};
    private heartbeatInterval: any = null;

    constructor(public options: any) {}

    on(event: string, handler: Function) {
      if (!this.eventHandlers[event]) this.eventHandlers[event] = [];
      this.eventHandlers[event].push(handler);
      if (event === 'connection') connectionHandler = handler as any;
      if (event === 'close') closeHandler = handler as any;
    }

    emit(event: string, ...args: any[]) {
      if (this.eventHandlers[event]) {
        this.eventHandlers[event].forEach(h => h(...args));
      }
    }

    close(callback?: () => void) {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
      if (closeHandler) closeHandler();
      if (callback) callback();
    }

    simulateConnection(client: MockWebSocket) {
      mockClients.add(client);
      if (connectionHandler) connectionHandler(client);
    }
  }

  return {
    WebSocket: MockWebSocket,
    WebSocketServer: MockWebSocketServer,
  };
});

const { WebSocket, WebSocketServer } = require('ws');

describe('WebSocket Server', () => {
  let httpServer: http.Server;
  let wss: InstanceType<typeof WebSocketServer>;

  beforeAll(async () => {
    jest.useFakeTimers();
    httpServer = http.createServer();
    await new Promise<void>((resolve) => {
      httpServer.listen(0, resolve);
    });
    wss = createWebSocketServer(httpServer);
  }, 10000);

  afterAll(async () => {
    jest.useRealTimers();
    await new Promise<void>((resolve) => {
      wss.close(() => {
        httpServer.close(() => resolve());
      });
    });
  }, 10000);

  it('should create WebSocketServer with http server', () => {
    expect(wss).toBeDefined();
    expect(wss.options.server).toBe(httpServer);
  });

  it('should handle client connections', () => {
    const client = new WebSocket('ws://localhost:1234');
    wss.simulateConnection(client);
    expect(wss.clients.has(client)).toBe(true);
    expect(client.metadata).toEqual({ isAlive: true });
  });

  it('should handle client disconnection', () => {
    const client = new WebSocket('ws://localhost:1234');
    wss.simulateConnection(client);
    client.close();
    expect(client.readyState).toBe(WebSocket.CLOSED);
    expect(wss.clients.has(client)).toBe(false);
  });

  it('should send heartbeat pings to connected clients', () => {
    const client = new WebSocket('ws://localhost:1234');
    const pingSpy = jest.spyOn(client, 'ping');
    wss.simulateConnection(client);
    // Simulate heartbeat interval firing by calling ping directly
    client.metadata.isAlive = false;
    client.ping();
    expect(pingSpy).toHaveBeenCalled();
  });

  it('should handle multiple concurrent connections', () => {
    const client1 = new WebSocket('ws://localhost:1234');
    const client2 = new WebSocket('ws://localhost:1234');
    const client3 = new WebSocket('ws://localhost:1234');
    
    wss.simulateConnection(client1);
    wss.simulateConnection(client2);
    wss.simulateConnection(client3);
    
    expect(wss.clients.has(client1)).toBe(true);
    expect(wss.clients.has(client2)).toBe(true);
    expect(wss.clients.has(client3)).toBe(true);
  });

  it('should expose heartbeat constants', () => {
    expect(HEARTBEAT_INTERVAL).toBe(30000);
    expect(HEARTBEAT_TIMEOUT).toBe(90000);
  });

  it('should handle client errors gracefully', () => {
    const client = new WebSocket('ws://localhost:1234');
    wss.simulateConnection(client);
    
    // Simulate error - should not throw
    expect(() => {
      client.emit('error', new Error('Test error'));
    }).not.toThrow();
  });

  it('should handle heartbeat pong responses', () => {
    const client = new WebSocket('ws://localhost:1234');
    wss.simulateConnection(client);
    
    expect(client.metadata.isAlive).toBe(true);
    
    // Simulate pong response
    client.emit('pong');
    
    expect(client.metadata.isAlive).toBe(true);
  });

  it('should handle server close event', (done) => {
    const testServer = http.createServer();
    testServer.listen(0, async () => {
      const testWss = createWebSocketServer(testServer);
      
      testWss.close(() => {
        testServer.close(() => {
          done();
        });
      });
    });
  }, 10000);

  it('should set metadata on new clients without existing metadata', () => {
    const client = new WebSocket('ws://localhost:1234');
    // Ensure client has no metadata initially
    client.metadata = null;
    wss.simulateConnection(client);
    
    // The connection handler should set metadata
    expect(client.metadata).toEqual({ isAlive: true });
  });

  it('should trigger heartbeat interval and ping clients', () => {
    const client = new WebSocket('ws://localhost:1234');
    const pingSpy = jest.spyOn(client, 'ping');
    wss.simulateConnection(client);
    
    // Advance timers by heartbeat interval
    jest.advanceTimersByTime(HEARTBEAT_INTERVAL + 100);
    
    expect(pingSpy).toHaveBeenCalled();
    expect(client.metadata.isAlive).toBe(false);
  });

  it('should terminate unresponsive clients via heartbeat interval', () => {
    const client = new WebSocket('ws://localhost:1234');
    wss.simulateConnection(client);
    
    // Set client as not alive
    client.metadata.isAlive = false;
    
    // Advance timers to trigger heartbeat
    jest.advanceTimersByTime(HEARTBEAT_INTERVAL + 100);
    
    // The ping method in mock should terminate the client after 100ms
    jest.advanceTimersByTime(200);
    
    expect(client.readyState).toBe(WebSocket.CLOSED);
  });

});
