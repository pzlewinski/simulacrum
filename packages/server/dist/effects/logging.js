"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const effect_1 = require("../effect");
const assert_ts_1 = require("assert-ts");
const effection_1 = require("effection");
function createLogger(slice) {
    return {
        name: 'logger',
        *init(scope) {
            let task = yield (0, effection_1.spawn)();
            yield (0, effection_1.spawn)(slice.slice("debug").forEach(function* (shouldLogErrors) {
                yield task.halt();
                if (shouldLogErrors) {
                    task = yield (0, effection_1.spawn)((0, effect_1.map)(slice.slice("simulations"), function* (simulation) {
                        yield simulation.filter(({ status }) => status === 'failed').forEach(state => {
                            (0, assert_ts_1.assert)(state.status === 'failed');
                            console.error(state.error);
                        });
                    })).within(scope);
                }
            }));
        }
    };
}
exports.createLogger = createLogger;
//# sourceMappingURL=logging.js.map