"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenIdHandlers = void 0;
const constants_1 = require("../auth/constants");
const get_service_url_1 = require("./get-service-url");
const url_1 = require("./url");
const createOpenIdHandlers = (options) => {
    return {
        ['/.well-known/jwks.json']: function* (_, res) {
            res.json(constants_1.JWKS);
        },
        ['/.well-known/openid-configuration']: function* (_, res) {
            let url = (0, url_1.removeTrailingSlash)((0, get_service_url_1.getServiceUrl)(options).toString());
            res.json({
                issuer: `${url}/`,
                authorization_endpoint: [url, "authorize"].join('/'),
                token_endpoint: [url, "oauth", "token"].join('/'),
                userinfo_endpoint: [url, "userinfo"].join('/'),
                jwks_uri: [url, ".well-known", "jwks.json"].join('/'),
            });
        },
    };
};
exports.createOpenIdHandlers = createOpenIdHandlers;
//# sourceMappingURL=openid-handlers.js.map