"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogger = exports.createSimulationServer = void 0;
var server_1 = require("./server");
Object.defineProperty(exports, "createSimulationServer", { enumerable: true, get: function () { return server_1.createSimulationServer; } });
var console_logger_1 = require("./middleware/console-logger");
Object.defineProperty(exports, "consoleLogger", { enumerable: true, get: function () { return console_logger_1.consoleLogger; } });
__exportStar(require("./http"), exports);
__exportStar(require("./simulators/person"), exports);
__exportStar(require("./config/paths"), exports);
//# sourceMappingURL=index.js.map