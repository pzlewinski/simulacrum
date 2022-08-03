"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationSchema = void 0;
const zod_1 = require("zod");
// TODO: better validation
exports.configurationSchema = zod_1.z.object({
    port: zod_1.z.optional(zod_1.z
        .number()
        .gt(2999, "port must be greater than 2999")
        .lt(10000, "must be less than 10000")),
    domain: zod_1.z.optional(zod_1.z.string().min(1, "domain is required")),
    audience: zod_1.z.optional(zod_1.z.string().min(1, "audience is required")),
    clientID: zod_1.z.optional(zod_1.z.string().max(32, "must be 32 characters long")),
    scope: zod_1.z.string().min(1, "scope is required"),
    clientSecret: zod_1.z.optional(zod_1.z.string()),
    rulesDirectory: zod_1.z.optional(zod_1.z.string()),
    auth0SessionCookieName: zod_1.z.optional(zod_1.z.string()),
    auth0CookieSecret: zod_1.z.optional(zod_1.z.string()),
    connection: zod_1.z.optional(zod_1.z.string()),
    cookieSecret: zod_1.z.optional(zod_1.z.string()),
});
//# sourceMappingURL=types.js.map