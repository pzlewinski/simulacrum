"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
function map(slice, effect) {
    return function* (scope) {
        let effects = new Map();
        function* synchronize(record) {
            let keep = new Set();
            // the checks for non-null `record` and `value`
            // should not be necessary, except for some weirdness
            // when removing values from our Atom means that sometimes
            // the are.
            if (record) {
                for (let [key, value] of Object.entries(record)) {
                    // see comment above
                    if (value) {
                        if (!effects.has(key)) {
                            effects.set(key, scope.run(effect(slice.slice(key))));
                        }
                        keep.add(key);
                    }
                }
            }
            for (let [key, effect] of effects.entries()) {
                if (!keep.has(key)) {
                    effects.delete(key);
                    yield effect.halt();
                }
            }
        }
        yield synchronize(slice.get());
        yield slice.forEach(synchronize);
    };
}
exports.map = map;
//# sourceMappingURL=effect.js.map