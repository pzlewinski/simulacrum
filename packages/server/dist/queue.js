"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = void 0;
function createQueue() {
    let waiters = [];
    let values = [];
    return {
        push(value) {
            let next = waiters.pop();
            if (next) {
                next(value);
            }
            else {
                values.push(value);
            }
        },
        pop() {
            return new Promise(resolve => {
                if (values.length) {
                    resolve(values.shift());
                }
                else {
                    waiters.unshift(resolve);
                }
            });
        }
    };
}
exports.createQueue = createQueue;
//# sourceMappingURL=queue.js.map