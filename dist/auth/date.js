"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epochTimeToLocalDate = exports.expiresAt = exports.epochTime = void 0;
const epochTime = (date = Date.now()) => Math.floor(date / 1000);
exports.epochTime = epochTime;
const expiresAt = (hours = 1) => (0, exports.epochTime)() + hours * 60 * 60 * 1000;
exports.expiresAt = expiresAt;
const epochTimeToLocalDate = (epoch) => {
    let date = new Date(0);
    date.setUTCSeconds(epoch);
    return date;
};
exports.epochTimeToLocalDate = epochTimeToLocalDate;
//# sourceMappingURL=date.js.map