"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paths = void 0;
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const rootDir = path_1.default.join((0, os_1.homedir)(), ".simulacrum");
const certificatesDir = path_1.default.join(rootDir, "certs");
const pemFile = path_1.default.join(certificatesDir, "localhost.pem");
const keyFile = path_1.default.join(certificatesDir, "localhost-key.pem");
exports.paths = {
    rootDir,
    certificatesDir,
    ssl: {
        pemFile,
        keyFile
    }
};
//# sourceMappingURL=paths.js.map