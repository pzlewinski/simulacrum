"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulationServer = exports.createServer = void 0;
const atom_1 = require("@effection/atom");
const ui_1 = require("@simulacrum/ui");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const uuid_1 = require("uuid");
const schema_1 = require("./schema/schema");
const http_1 = require("./http");
var http_2 = require("./http");
Object.defineProperty(exports, "createServer", { enumerable: true, get: function () { return http_2.createServer; } });
const faker_1 = require("./faker");
const websocket_transport_1 = require("./websocket-transport");
const operation_context_1 = require("./operation-context");
const logging_1 = require("./effects/logging");
const defaults = {
    simulators: {},
    debug: false
};
function createSimulationServer(options = defaults) {
    let { simulators, debug, port, seed } = { ...defaults, ...options };
    return {
        *init(scope) {
            let newid = seed ? (0, faker_1.stableIds)(seed) : uuid_1.v4;
            let atom = (0, atom_1.createAtom)({
                debug: !!debug,
                simulations: {}
            });
            let context = (0, operation_context_1.createOperationContext)(atom, scope, newid, simulators);
            let app = (0, express_1.default)()
                .use((0, cors_1.default)())
                .disable('x-powered-by')
                .use(express_1.default.static((0, ui_1.appDir)()))
                .use('/', (0, express_graphql_1.graphqlHTTP)({ schema: schema_1.schema, context }));
            let server = yield (0, http_1.createServer)(app, { protocol: 'http', port });
            yield (0, websocket_transport_1.createWebSocketTransport)(context, server.http);
            yield (0, logging_1.createLogger)(atom);
            return server;
        }
    };
}
exports.createSimulationServer = createSimulationServer;
//# sourceMappingURL=server.js.map