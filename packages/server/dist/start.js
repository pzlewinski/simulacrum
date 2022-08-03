"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const effection_1 = require("effection");
const echo_1 = require("./echo");
const server_1 = require("./server");
const http_1 = require("./http");
const person_1 = __importDefault(require("./simulators/person"));
const get_port_1 = __importDefault(require("get-port"));
(0, effection_1.main)(function* () {
    let port = yield (0, get_port_1.default)({
        port: !!process.env.PORT ? Number(process.env.PORT) : undefined
    });
    let server = yield (0, server_1.createSimulationServer)({
        debug: true,
        port,
        seed: 1,
        simulators: {
            person: person_1.default,
            echo: () => ({
                services: {
                    echo: {
                        protocol: 'http',
                        app: (0, http_1.createHttpApp)().post('/', (0, echo_1.echo)(1))
                    }
                },
                scenarios: {}
            }),
        }
    });
    let address = server.address;
    console.log(`Simulation server running on http://localhost:${address.port}`);
    yield;
});
//# sourceMappingURL=start.js.map