"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
const nexus_1 = require("nexus");
const operations_1 = require("./operations");
exports.types = [
    (0, nexus_1.scalarType)({
        name: "JSON",
        description: "JSON value",
        serialize: value => value,
        parseValue: value => value
    }),
    (0, nexus_1.objectType)({
        name: 'Service',
        definition(t) {
            t.nonNull.string('name');
            t.nonNull.string('url');
        }
    }),
    (0, nexus_1.objectType)({
        name: 'Simulation',
        definition(t) {
            t.id('id');
            t.nonNull.string('status');
            t.nonNull.list.field('services', {
                type: 'Service'
            });
        }
    }),
    (0, nexus_1.mutationType)({
        definition(t) {
            t.field('createSimulation', {
                type: 'Simulation',
                args: {
                    seed: (0, nexus_1.intArg)(),
                    simulator: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                    options: (0, nexus_1.arg)({
                        type: 'JSON',
                        description: "options to pass to the simulation"
                    }),
                    debug: (0, nexus_1.booleanArg)(),
                },
                ...operations_1.createSimulation
            });
            t.field('destroySimulation', {
                type: 'Boolean',
                args: {
                    id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
                },
                ...operations_1.destroySimulation
            });
            t.field('given', {
                type: 'JSON',
                args: {
                    simulation: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                    a: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                    params: (0, nexus_1.arg)({
                        type: 'JSON',
                        description: "parameters for this scenario",
                        default: {}
                    })
                },
                ...operations_1.given
            });
        }
    }),
    (0, nexus_1.subscriptionType)({
        definition(t) {
            t.field('state', {
                type: 'JSON',
                ...operations_1.state
            });
        }
    })
];
//# sourceMappingURL=types.js.map