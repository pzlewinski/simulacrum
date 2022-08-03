"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const cookie_session_1 = __importDefault(require("cookie-session"));
const twentyFourHours = 24 * 60 * 60 * 1000;
const createSession = () => {
    return (0, cookie_session_1.default)({
        name: "session",
        keys: ["shhh"],
        secure: true,
        httpOnly: false,
        maxAge: twentyFourHours,
        sameSite: "none",
    });
};
exports.createSession = createSession;
//# sourceMappingURL=session.js.map