"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonWebToken = exports.parseKey = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("./constants");
const parseKey = (key) => key.split("~~").join("\n");
exports.parseKey = parseKey;
const createJsonWebToken = (payload, privateKey = (0, exports.parseKey)(constants_1.PRIVATE_KEY), options = {
    algorithm: "RS256",
    keyid: constants_1.JWKS.keys[0].kid,
}) => {
    return (0, jsonwebtoken_1.sign)(payload, privateKey, options);
};
exports.createJsonWebToken = createJsonWebToken;
//# sourceMappingURL=jwt.js.map