"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRulesRunner = void 0;
const path_1 = __importDefault(require("path"));
const vm_1 = __importDefault(require("vm"));
const fs_1 = __importDefault(require("fs"));
const assert_ts_1 = require("assert-ts");
const parse_rules_files_1 = require("./parse-rules-files");
function createRulesRunner(rulesPath) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callback = (_user, _context) => { };
    if (typeof rulesPath === 'undefined') {
        return callback;
    }
    let fullPath = path_1.default.join(process.cwd(), rulesPath);
    (0, assert_ts_1.assert)(fs_1.default.existsSync(fullPath), `no rules directory at ${fullPath}`);
    let rules = (0, parse_rules_files_1.parseRulesFiles)(rulesPath);
    if (rules.length === 0) {
        return callback;
    }
    return (user, context) => {
        console.debug(`applying ${rules.length} rules`);
        let vmContext = vm_1.default.createContext({
            process,
            Buffer,
            clearImmediate,
            clearInterval,
            clearTimeout,
            setImmediate,
            setInterval,
            setTimeout,
            console,
            require,
            module,
            __simulator: {
                ...{
                    user,
                    context: { ...context, },
                    callback,
                },
            },
        });
        for (let rule of rules) {
            (0, assert_ts_1.assert)(typeof rule !== "undefined", "undefined rule");
            let { code, filename } = rule;
            console.debug(`executing rule ${path_1.default.basename(filename)}`);
            let script = new vm_1.default.Script(`(function(exports) {
            (${code})(__simulator.user, __simulator.context, __simulator.callback)
          }
          (module.exports));
        `);
            script.runInContext(vmContext, {
                filename,
            });
        }
    };
}
exports.createRulesRunner = createRulesRunner;
//# sourceMappingURL=rules-runner.js.map