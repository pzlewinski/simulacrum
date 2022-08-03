"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echo = void 0;
const echo = (times) => function echo(request, response) {
    return function* () {
        var _a, _b;
        response.contentType((_a = request.headers['content-type']) !== null && _a !== void 0 ? _a : "application/octet-stream");
        let body = Array(times).fill((_b = request.body) !== null && _b !== void 0 ? _b : "echo").join("\n");
        response.status(200).write(body);
    };
};
exports.echo = echo;
//# sourceMappingURL=echo.js.map