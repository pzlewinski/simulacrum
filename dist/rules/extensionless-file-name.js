"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionlessFileName = void 0;
const extensionlessFileName = (fileName) => fileName.indexOf(".") === -1
    ? fileName
    : fileName.split(".").slice(0, -1).join(".");
exports.extensionlessFileName = extensionlessFileName;
//# sourceMappingURL=extensionless-file-name.js.map