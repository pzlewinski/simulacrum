"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequestHandler = exports.middlewareHandlerIsOperation = exports.isGeneratorFunction = void 0;
function isGeneratorFunction(value) {
    return /\[object Generator|GeneratorFunction\]/.test(Object.prototype.toString.call(value));
}
exports.isGeneratorFunction = isGeneratorFunction;
function middlewareHandlerIsOperation(value) {
    return isGeneratorFunction(value);
}
exports.middlewareHandlerIsOperation = middlewareHandlerIsOperation;
function isRequestHandler(value) {
    return isGeneratorFunction(value) === false && typeof value === 'function';
}
exports.isRequestHandler = isRequestHandler;
//# sourceMappingURL=guards.js.map