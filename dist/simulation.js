"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulation = exports.createSimulation = void 0;
const effection_1 = require("effection");
const assert_ts_1 = require("assert-ts");
const effect_1 = require("./effect");
const express_1 = __importStar(require("express"));
const http_1 = require("./http");
const faker_1 = require("./faker");
const guards_1 = require("./guards/guards");
function normalizeServiceCreator(service) {
    if (typeof service === 'function') {
        return service;
    }
    return function resource(slice, options) {
        return {
            *init(scope) {
                var _a;
                let app = (0, express_1.default)();
                for (let handler of service.app.middleware) {
                    if ((0, guards_1.isRequestHandler)(handler)) {
                        app.use(handler);
                        continue;
                    }
                    app.use(function (req, res, next) {
                        (0, assert_ts_1.assert)((0, guards_1.middlewareHandlerIsOperation)(handler), 'invalid middleware function');
                        scope.run(handler(req, res))
                            .then(next)
                            .catch(next);
                    });
                }
                app.use((0, express_1.raw)({ type: "*/*" }));
                for (let handler of service.app.handlers) {
                    app[handler.method](handler.path, (request, response) => {
                        // if the scope is already shutting down or shut down
                        // just ignore this request.
                        if (scope.state === 'running') {
                            scope.run(function* () {
                                yield (0, effection_1.label)({ name: 'request', method: handler.method, path: handler.path });
                                try {
                                    yield handler.handler(request, response);
                                }
                                catch (err) {
                                    response.status(500);
                                    response.write('server error');
                                }
                                finally {
                                    response.end();
                                }
                            });
                        }
                    });
                }
                let port = (_a = options.port) !== null && _a !== void 0 ? _a : service.port;
                let server = yield (0, http_1.createServer)(app, { protocol: service.protocol, port });
                return {
                    port: server.address.port,
                    protocol: service.protocol
                };
            }
        };
    };
}
function createSimulation(slice, simulators) {
    return (0, effection_1.spawn)(function* () {
        try {
            yield function* errorBoundary() {
                var _a;
                let simulatorName = slice.get().simulator;
                yield (0, effection_1.label)({ name: 'simulation', simulator: simulatorName });
                let simulator = simulators[simulatorName];
                let store = slice.slice("store");
                (0, assert_ts_1.assert)(simulator, `unknown simulator ${simulatorName}`);
                let { options = {}, services: serviceOptions = {} } = slice.get().options;
                let behaviors = simulator(slice, options);
                let servers = Object.entries(behaviors.services).map(([name, service]) => {
                    return {
                        name,
                        create: normalizeServiceCreator(service)
                    };
                });
                let services = [];
                for (let { name, create } of servers) {
                    let service = yield create(slice, (_a = serviceOptions[name]) !== null && _a !== void 0 ? _a : {});
                    services.push({ name, url: `${service.protocol}://localhost:${service.port}` });
                }
                let { scenarios, effects } = behaviors;
                // we can support passing a seed to a scenario later, but let's
                // just hard-code it for now.
                let faker = (0, faker_1.createFaker)(2);
                yield (0, effection_1.spawn)((0, effect_1.map)(slice.slice("scenarios"), slice => function* () {
                    try {
                        let { name, params } = slice.get();
                        let fn = scenarios[name];
                        (0, assert_ts_1.assert)(fn, `unknown scenario ${name}`);
                        let data = yield fn(store, faker, params);
                        slice.update(state => ({
                            ...state,
                            status: 'running',
                            data
                        }));
                    }
                    catch (error) {
                        slice.update(state => ({
                            ...state,
                            status: 'failed',
                            error: error
                        }));
                    }
                }));
                if (typeof effects !== 'undefined') {
                    yield (0, effection_1.spawn)(effects());
                }
                slice.update(state => ({
                    ...state,
                    status: 'running',
                    services
                }));
                // all spun up, we can just wait.
                yield;
            };
        }
        catch (error) {
            slice.update((state) => ({
                ...state,
                status: "failed",
                error: error,
                services: []
            }));
        }
    });
}
exports.createSimulation = createSimulation;
function simulation(simulators) {
    return function* (slice) {
        let simulationTask = yield createSimulation(slice, simulators);
        yield slice.filter(({ status }) => status == "destroying").expect();
        yield simulationTask.halt();
        slice.slice("status").set("halted");
    };
}
exports.simulation = simulation;
//# sourceMappingURL=simulation.js.map