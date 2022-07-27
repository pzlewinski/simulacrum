"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocket = exports.createWebSocketTransport = void 0;
const effection_1 = require("effection");
const graphql_1 = require("graphql");
const graphql_ws_1 = require("graphql-ws");
const ws_1 = __importDefault(require("ws"));
const schema_1 = require("./schema/schema");
/**
 * Create a graphql-ws transport resource that can execute operations in the context
 * of a websocket.
 *
 * Every websocket gets its own effection scope, and graphql operations are
 * executed there instead of the main server scope.
 */
function createWebSocketTransport(context, server) {
    return {
        *init(scope) {
            let transport = (0, graphql_ws_1.makeServer)({
                schema: schema_1.schema,
                onConnect: () => true,
                onSubscribe({ extra }, message) {
                    let { operationName, variables: variableValues } = message.payload;
                    return {
                        schema: schema_1.schema,
                        operationName,
                        variableValues,
                        document: (0, graphql_1.parse)(message.payload.query),
                        contextValue: {
                            ...context,
                            scope: extra
                        }
                    };
                },
                execute: graphql_1.execute,
                subscribe: graphql_1.subscribe,
            });
            yield (0, effection_1.spawn)(function* () {
                let sockets = new ws_1.default.Server({ server });
                try {
                    yield (0, effection_1.on)(sockets, 'connection').forEach(function* (socket) {
                        yield (0, effection_1.spawn)(function* (child) {
                            try {
                                let websocket = yield createWebSocket(socket);
                                let closed = transport.opened(websocket, child);
                                let close = yield (0, effection_1.once)(socket, 'close');
                                yield closed(close.code, close.reason);
                            }
                            finally {
                                socket.close();
                            }
                        }).within(scope);
                    });
                }
                finally {
                    sockets.close();
                }
            });
        }
    };
}
exports.createWebSocketTransport = createWebSocketTransport;
function createWebSocket(ws) {
    return {
        *init(scope) {
            yield (0, effection_1.spawn)((0, effection_1.throwOnErrorEvent)(ws));
            return {
                protocol: ws.protocol,
                send: (data) => new Promise((resolve, reject) => {
                    if (scope.state === 'running') {
                        ws.send(data, (err) => (err ? reject(err) : resolve()));
                    }
                }),
                close: (code, reason) => ws.close(code, reason),
                onMessage(cb) {
                    // spawn a task to dispatch each message asynchronously.
                    scope.run((0, effection_1.on)(ws, 'message').forEach(message => {
                        scope.run(cb(message.data.toString()));
                    }));
                }
            };
        }
    };
}
exports.createWebSocket = createWebSocket;
//# sourceMappingURL=websocket-transport.js.map