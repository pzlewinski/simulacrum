"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableIds = exports.createFaker = void 0;
// @ts-ignore
const lib_1 = __importDefault(require("faker/lib"));
// @ts-ignore
const locales_1 = __importDefault(require("faker/lib/locales"));
function createFaker(seed) {
    let faker = new lib_1.default({ locales: locales_1.default });
    faker.seed(seed);
    return faker;
}
exports.createFaker = createFaker;
function stableIds(seed) {
    let faker = createFaker(seed);
    return () => faker.datatype.uuid();
}
exports.stableIds = stableIds;
//# sourceMappingURL=faker.js.map