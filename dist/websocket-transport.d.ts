/// <reference types="node" />
import type { Resource } from 'effection';
import type { Server as HTTPServer } from 'http';
import type { WebSocket } from 'graphql-ws';
import WS from 'ws';
import type { OperationContext } from './schema/context';
/**
 * Create a graphql-ws transport resource that can execute operations in the context
 * of a websocket.
 *
 * Every websocket gets its own effection scope, and graphql operations are
 * executed there instead of the main server scope.
 */
export declare function createWebSocketTransport(context: OperationContext, server: HTTPServer): Resource<void>;
export declare function createWebSocket(ws: WS): Resource<WebSocket>;
//# sourceMappingURL=websocket-transport.d.ts.map