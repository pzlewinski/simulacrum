"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const nexus_1 = require("nexus");
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
exports.schema = (0, nexus_1.makeSchema)({
    shouldGenerateArtifacts: false,
    types: types_1.types,
    sourceTypes: {
        modules: [
            {
                module: path_1.default.join(__dirname, '../interfaces.ts'),
                alias: 'types',
                typeMatch: (type) => new RegExp(`(?:interface)\\s+(${type.name}s)\\W`),
            },
        ]
    },
    contextType: {
        module: path_1.default.join(__dirname, 'context.ts'),
        export: 'Context',
    },
});
exports.default = exports.schema;
//# sourceMappingURL=schema.js.map