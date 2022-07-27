"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginRedirectHandler = void 0;
const querystring_1 = require("querystring");
const createLoginRedirectHandler = (options) => function* loginRedirect(req, res) {
    let { client_id, redirect_uri, scope, state, nonce, response_mode, code_challenge, code_challenge_method, auth0Client, response_type, } = req.query;
    res.status(302).redirect(`/login?${(0, querystring_1.stringify)({
        state,
        redirect_uri,
        client: client_id,
        protocol: "oauth2",
        scope,
        response_type,
        response_mode,
        nonce,
        code_challenge,
        code_challenge_method,
        auth0Client,
        audience: options.audience,
    })}`);
};
exports.createLoginRedirectHandler = createLoginRedirectHandler;
//# sourceMappingURL=login-redirect.js.map