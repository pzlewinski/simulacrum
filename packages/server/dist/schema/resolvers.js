"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = exports.given = exports.destroySimulation = exports.createSimulation = void 0;
const uuid_1 = require("uuid");
const queue_1 = require("../queue");
const assert_ts_1 = require("assert-ts");
exports.createSimulation = {
    async resolve(args, ctx) {
        let { simulator, options = {}, debug = false } = args;
        return await ctx.createSimulation(simulator, options, debug);
    }
};
exports.destroySimulation = {
    async resolve({ id }, { destroySimulation }) {
        return await destroySimulation(id);
    }
};
exports.given = {
    resolve({ simulation: simulationId, a: scenarioName, params }, context) {
        let { scope, atom } = context;
        let simulation = atom.slice("simulations").slice(simulationId);
        (0, assert_ts_1.assert)(simulation.get() != null, `no simulation found with id: ${simulationId}`);
        let id = (0, uuid_1.v4)();
        let scenario = simulation.slice('scenarios').slice(id);
        scenario.set({ id, status: 'new', name: scenarioName, params });
        return scope.run(scenario.filter(({ status }) => status !== 'new').expect());
    }
};
exports.state = {
    subscribe(_args, { scope, atom }) {
        let queue = (0, queue_1.createQueue)();
        scope.run(atom.forEach(queue.push));
        return {
            [Symbol.asyncIterator]: () => ({
                async next() {
                    let value = await queue.pop();
                    return {
                        done: false,
                        value
                    };
                }
            })
        };
    }
};
//# sourceMappingURL=resolvers.js.map