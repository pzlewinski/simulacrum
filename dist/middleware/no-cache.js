"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
const noCache = () => (_, res, next) => {
    res.set("Pragma", "no-cache");
    res.set("Cache-Control", "no-cache, no-store");
    next();
};
exports.noCache = noCache;
//# sourceMappingURL=no-cache.js.map