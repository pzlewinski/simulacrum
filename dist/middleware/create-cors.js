"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCors = void 0;
const cors_1 = __importDefault(require("cors"));
const createCors = () => (0, cors_1.default)({
    origin: (origin, cb) => {
        if (typeof origin === "string") {
            return cb(null, [origin]);
        }
        cb(null, "*");
    },
    credentials: true,
});
exports.createCors = createCors;
//# sourceMappingURL=create-cors.js.map