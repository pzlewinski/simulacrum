"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperationContext = void 0;
const simulation_1 = require("./simulation");
function createOperationContext(atom, scope, newid, simulators) {
    let simulationsMap = new Map();
    return {
        atom,
        scope,
        async createSimulation(simulator, options, debug) {
            var _a;
            let simulationId = (_a = options.key) !== null && _a !== void 0 ? _a : newid();
            let existing = simulationsMap.get(simulationId);
            if (!!existing) {
                await existing.halt();
            }
            let slice = atom.slice("simulations", simulationId);
            slice.set({
                id: simulationId,
                status: 'new',
                simulator,
                options,
                services: [],
                scenarios: {},
                store: {},
                debug,
            });
            await scope.run(function* () {
                let simulationTask = yield scope.spawn(function* () {
                    yield (0, simulation_1.createSimulation)(slice, simulators);
                    try {
                        yield;
                    }
                    finally {
                        simulationsMap.delete(simulationId);
                        slice.remove();
                    }
                });
                simulationsMap.set(simulationId, simulationTask);
                yield slice.filter(({ status }) => status === 'running').expect();
            });
            return slice.get();
        },
        async destroySimulation(simulationId) {
            let simulation = simulationsMap.get(simulationId);
            if (!simulation) {
                return false;
            }
            await simulation.halt();
            return true;
        },
        newid
    };
}
exports.createOperationContext = createOperationContext;
//# sourceMappingURL=operation-context.js.map