"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogger = void 0;
function getFormattedDate() {
    let timestamp = new Date();
    let date = [timestamp.getFullYear(),
        (timestamp.getMonth() + 1),
        timestamp.getDate()].join('-');
    let time = [
        timestamp.getHours(),
        timestamp.getMinutes(),
        timestamp.getSeconds()
    ].join(':');
    return [date, time].join(' ');
}
function safeJSONStringify(o) {
    try {
        return JSON.stringify(o, null, 4);
    }
    catch {
        return '';
    }
}
const consoleLogger = function* (req, res) {
    var _a, _b, _c;
    console.log(`-----------------------------------------------
[${getFormattedDate()}]

${req.method.toUpperCase()}

${(_a = req.originalUrl) !== null && _a !== void 0 ? _a : req.url}

query
${safeJSONStringify((_b = req.query) !== null && _b !== void 0 ? _b : {})}

body
${safeJSONStringify((_c = req.body) !== null && _c !== void 0 ? _c : {})}

${res.statusCode}
-----------------------------------------------`);
};
exports.consoleLogger = consoleLogger;
//# sourceMappingURL=console-logger.js.map