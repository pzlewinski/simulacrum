"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRulesFiles = void 0;
const extensionless_file_name_1 = require("./extensionless-file-name");
const assert_ts_1 = require("assert-ts");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseRulesFiles(rulesPath) {
    var _a;
    let ruleFiles = fs_1.default
        .readdirSync(rulesPath)
        .filter((f) => path_1.default.extname(f) === ".js");
    return (_a = ruleFiles
        .map((r) => {
        let filename = path_1.default.join(rulesPath, r);
        let jsonFile = `${(0, extensionless_file_name_1.extensionlessFileName)(filename)}.json`;
        (0, assert_ts_1.assert)(!!jsonFile, `no corresponding rule file for ${r}`);
        let rawRule = fs_1.default.readFileSync(jsonFile, 'utf8');
        let { enabled, order = 0, stage = "login_success", } = JSON.parse(rawRule);
        if (!enabled) {
            return undefined;
        }
        let code = fs_1.default.readFileSync(filename, {
            encoding: "utf-8",
        });
        return { code, filename, order, stage };
    })
        .flatMap(x => !!x ? x : [])
        .sort((left, right) => left.order - right.order)) !== null && _a !== void 0 ? _a : [];
}
exports.parseRulesFiles = parseRulesFiles;
//# sourceMappingURL=parse-rules-files.js.map