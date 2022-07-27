"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const effection_1 = require("effection");
const graphql_ws_1 = require("graphql-ws");
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
function createClient(serverURL) {
    let wsurl = new URL(serverURL);
    wsurl.protocol = 'ws';
    let url = wsurl.toString();
    let ws = (0, graphql_ws_1.createClient)({ url, webSocketImpl: isomorphic_ws_1.default });
    let scope = (0, effection_1.run)(function* () {
        try {
            yield;
        }
        finally {
            let dispose = ws.dispose();
            if (dispose) {
                yield dispose;
            }
        }
    });
    function subscribe(payload) {
        return {
            run(scope) {
                let { send, close, stream } = (0, effection_1.createChannel)();
                let { future, produce } = (0, effection_1.createFuture)();
                scope.run(function* () {
                    let unsubscribe = ws.subscribe(payload, {
                        next: send,
                        complete: () => produce({ state: "completed", value: undefined }),
                        error: () => null
                    });
                    try {
                        yield future;
                    }
                    finally {
                        close();
                        unsubscribe();
                    }
                });
                return stream.subscribe(scope);
            }
        };
    }
    async function query(field, payload) {
        return scope.run(function* (child) {
            yield (0, effection_1.sleep)(10);
            let subscription = subscribe(payload).run(child);
            let result = yield subscription.expect();
            return result.data[field];
        });
    }
    return {
        createSimulation: async (simulator, options) => {
            return query("createSimulation", {
                query: `
mutation CreateSimulation($simulator: String, $options: JSON, $debug: Boolean) {
  createSimulation(simulator: $simulator, options: $options, debug: $debug) {
    id
    simulators
    status
    services {
      name
      url
    }
  }
}`,
                operationName: 'CreateSimulation',
                variables: { simulator, options, debug: !!(options === null || options === void 0 ? void 0 : options.debug) }
            });
        },
        given: (simulation, scenario, params = {}) => query("given", {
            query: `
mutation Given($simulation: String!, $scenario: String, $params: JSON) {
  given(a: $scenario, simulation: $simulation, params: $params)
}
`,
            variables: { scenario, simulation: simulation.id, params }
        }),
        destroySimulation: ({ id }) => query("destroySimulation", {
            query: `
mutation DestroySimulation($id: String!) {
  destroySimulation(id: $id)
}`,
            variables: { id }
        }),
        state() {
            let child = scope.run();
            let subscription = subscribe({
                query: `subscription { state }`
            }).run(child);
            let iterator = {
                next() {
                    return child.run(function* () {
                        let next = yield subscription.next();
                        if (next.done) {
                            return { done: true };
                        }
                        else {
                            return { done: false, value: next.value.data.state };
                        }
                    });
                },
                cancel: () => child.halt(),
                [Symbol.asyncIterator]: () => iterator
            };
            return iterator;
        },
        dispose: () => scope.halt()
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map