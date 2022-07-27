"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuth0Handlers = void 0;
const login_redirect_1 = require("./login-redirect");
const web_message_1 = require("./web-message");
const login_1 = require("../views/login");
const assert_ts_1 = require("assert-ts");
const querystring_1 = require("querystring");
const base64_url_1 = require("base64-url");
const username_password_1 = require("../views/username-password");
const date_1 = require("../auth/date");
const jwt_1 = require("../auth/jwt");
const get_service_url_1 = require("./get-service-url");
const rules_runner_1 = require("../rules/rules-runner");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const getServiceUrlFromOptions = (options) => {
    let service = options.services.get().find(({ name }) => name === "auth0");
    (0, assert_ts_1.assert)(!!service, `did not find auth0 service in set of running services`);
    return new URL(service.url);
};
const createPersonQuery = (store) => (predicate) => {
    var _a;
    let people = (_a = store.slice("people").get()) !== null && _a !== void 0 ? _a : [];
    let entry = Object.entries(people).find(predicate);
    if (!entry) {
        return undefined;
    }
    else {
        let [, person] = entry;
        return person;
    }
};
//TODO: WIP (returns all users at the moment)
const searchPersonQuery = (store) => (predicate) => {
    var _a;
    let people = (_a = store.slice("people").get()) !== null && _a !== void 0 ? _a : [];
    let entry = Object.entries(people).filter(predicate);
    return entry;
};
// const updatePersonQuery = (store: Store, person: Person) => {
//   let people = store.slice("people");
//   let slice = people.slice(person.id);
//   assert(!!slice.get(), `no clientID assigned`);
//   slice.update(() => {
//     return person;
//   });
// };
// const newPersonQuery = (store: Store, data: any) => {
//   let people = store.slice("people");
//   let slice = people.slice(person.id);
//   assert(slice.get(), `person already exists`);
//   if (!slice.get()) {
//     slice.set(person);
//   }
// };
const createAuth0Handlers = (options) => {
    let { audience, scope, store, clientID, rulesDirectory } = options;
    let personQuery = createPersonQuery(store);
    let searchPerson = searchPersonQuery(store);
    let rulesRunner = (0, rules_runner_1.createRulesRunner)(rulesDirectory);
    let authorizeHandlers = {
        query: (0, login_redirect_1.createLoginRedirectHandler)(options),
        web_message: (0, web_message_1.createWebMessageHandler)(),
    };
    return {
        ["/heartbeat"]: function* (_, res) {
            res.status(200).json({ ok: true });
        },
        ["/authorize"]: function* (req, res) {
            var _a;
            let currentUser = req.query.currentUser;
            (0, assert_ts_1.assert)(!!req.session, "no session");
            if (currentUser) {
                // the request is a silent login.
                // We fake an existing login by
                // adding the user to the session
                req.session.username = currentUser;
            }
            let responseMode = ((_a = req.query.response_mode) !== null && _a !== void 0 ? _a : "query");
            (0, assert_ts_1.assert)(["query", "web_message"].includes(responseMode), `unknown response_mode ${responseMode}`);
            let handler = authorizeHandlers[responseMode];
            yield handler(req, res);
        },
        ["/login"]: function* (req, res) {
            let { redirect_uri } = req.query;
            let url = (0, get_service_url_1.getServiceUrl)(options);
            (0, assert_ts_1.assert)(!!clientID, `no clientID assigned`);
            let html = (0, login_1.loginView)({
                domain: url.host,
                scope,
                redirectUri: redirect_uri,
                clientID,
                audience,
                loginFailed: false,
            });
            res.set("Content-Type", "text/html");
            res.status(200).send(Buffer.from(html));
        },
        ["/usernamepassword/login"]: function* (req, res) {
            let { username, nonce, password } = req.body;
            (0, assert_ts_1.assert)(!!username, "no username in /usernamepassword/login");
            (0, assert_ts_1.assert)(!!nonce, "no nonce in /usernamepassword/login");
            (0, assert_ts_1.assert)(!!req.session, "no session");
            let user = personQuery(([, person]) => {
                var _a;
                return ((_a = person.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === username.toLowerCase() &&
                    person.password === password;
            });
            if (!user) {
                let { redirect_uri } = req.query;
                let url = getServiceUrlFromOptions(options);
                (0, assert_ts_1.assert)(!!clientID, `no clientID assigned`);
                let html = (0, login_1.loginView)({
                    domain: url.host,
                    scope,
                    redirectUri: redirect_uri,
                    clientID,
                    audience,
                    loginFailed: true,
                });
                res.set("Content-Type", "text/html");
                res.status(400).send(html);
                return;
            }
            req.session.username = username;
            store.slice("auth0").set({
                [nonce]: {
                    username,
                    nonce,
                },
            });
            res.status(200).send((0, username_password_1.userNamePasswordForm)(req.body));
        },
        ["/login/callback"]: function* (req, res) {
            let wctx = JSON.parse(req.body.wctx);
            let { redirect_uri, state, nonce } = wctx;
            let { username } = store.slice("auth0", nonce).get();
            let encodedNonce = (0, base64_url_1.encode)(`${nonce}:${username}`);
            let qs = (0, querystring_1.stringify)({ code: encodedNonce, state, nonce });
            let routerUrl = `${redirect_uri}?${qs}`;
            res.status(302).redirect(routerUrl);
        },
        ["/oauth/token"]: function* (req, res) {
            let { code, grant_type } = req.body;
            let user;
            let nonce;
            let username;
            let password;
            let idToken = "";
            if (grant_type === "password" ||
                grant_type === "http://auth0.com/oauth/grant-type/password-realm") {
                username = req.body.username;
                password = req.body.password;
                if (!username) {
                    res.status(400).send(`no nonce in store for ${code}`);
                    return;
                }
                user = personQuery(([, person]) => {
                    (0, assert_ts_1.assert)(!!person.email, `no email defined on person scenario`);
                    let valid = person.email.toLowerCase() === username.toLowerCase();
                    if (typeof password === "undefined") {
                        return valid;
                    }
                    else {
                        return valid && password === person.password;
                    }
                });
                if (!user) {
                    res.status(401).send("Unauthorized");
                    return;
                }
            }
            let url = getServiceUrlFromOptions(options).toString();
            (0, assert_ts_1.assert)(!!clientID, "no clientID in options");
            let idTokenData = {
                alg: "RS256",
                typ: "JWT",
                iss: url,
                exp: (0, date_1.expiresAt)(),
                iat: (0, date_1.epochTime)(),
                aud: clientID,
            };
            if (typeof nonce !== "undefined") {
                idTokenData.nonce = nonce;
            }
            let userData = {};
            let context = {
                clientID,
                accessToken: { scope },
                idToken: idTokenData,
            };
            rulesRunner(userData, context);
            idToken = (0, jwt_1.createJsonWebToken)({ ...userData, ...context.idToken });
            let accessToken = {
                aud: audience,
                iat: (0, date_1.epochTime)(),
                iss: idTokenData.iss,
                exp: idTokenData.exp,
                ...context.accessToken,
            };
            if (user) {
                idTokenData.sub = user.id;
                idTokenData.email = user.email;
                accessToken.sub = user.id;
            }
            res.status(200).json({
                access_token: (0, jwt_1.createJsonWebToken)({ ...accessToken }),
                id_token: idToken,
                expires_in: 86400,
                token_type: "Bearer",
            });
        },
        ["/v2/logout"]: function* (req, res) {
            var _a;
            req.session = null;
            let returnToUrl = (_a = req.query.returnTo) !== null && _a !== void 0 ? _a : req.headers.referer;
            (0, assert_ts_1.assert)(typeof returnToUrl === "string", `no logical returnTo url`);
            res.redirect(returnToUrl);
        },
        ["/userinfo"]: function* (req, res) {
            let authorizationHeader = req.headers.authorization;
            (0, assert_ts_1.assert)(!!authorizationHeader, "no authorization header");
            let [, token] = authorizationHeader.split(" ");
            let { sub } = (0, jsonwebtoken_1.decode)(token, { json: true });
            let user = personQuery(([, person]) => {
                (0, assert_ts_1.assert)(!!person.id, `no email defined on person scenario`);
                return person.id === sub;
            });
            (0, assert_ts_1.assert)(!!user, "no user in /userinfo");
            let userinfo = {
                sub,
                name: user.name,
                given_name: user.name,
                family_name: user.name,
                email: user.email,
                email_verified: true,
                locale: "en",
                hd: "okta.com",
            };
            res.status(200).json(userinfo);
        },
        ["get:/v2/users/:id"]: function* (req, res) {
            // let authorizationHeader = req.headers.authorization;
            // assert(!!authorizationHeader, "no authorization header");
            let user = personQuery(([, person]) => {
                (0, assert_ts_1.assert)(!!person.id, `no email defined on person scenario`);
                return person.id === req.params.id;
            });
            (0, assert_ts_1.assert)(!!user, "no user in /userinfo");
            res.status(200).json({ user_id: user.id, ...user });
        },
        ["get:/v2/users"]: function* (req, res) {
            // let authorizationHeader = req.headers.authorization;
            // assert(!!authorizationHeader, "no authorization header");
            let entry = searchPerson(([, person]) => {
                (0, assert_ts_1.assert)(!!person.email, `no email defined on person scenario`);
                let text = req.query.q;
                let query = text.split(":");
                if (query[0] === "email") {
                    let email = query[1].replace(/^"(.*)"$/, "$1");
                    console.log(email);
                    return person.email === email;
                }
                return true;
            });
            let result = entry.map(([, person]) => ({
                ...person,
                user_id: person.id,
            }));
            res.status(200).json({ users: result, length: result.length });
        },
        ["post:/v2/users"]: function* (req, res) {
            // let authorizationHeader = req.headers.authorization;
            var _a;
            // assert(!!authorizationHeader, "no authorization header");
            let params = req.body;
            let id = (_a = params.id) !== null && _a !== void 0 ? _a : "auth0|" + (0, uuid_1.v4)().replace(/-/g, "").slice(0, 24);
            let people = store.slice("people");
            let slice = people.slice(id);
            // assert(slice.get() != {}, `no clientID assigned`);
            let name = params.name;
            let attrs = {
                id,
                name,
                email: params.email,
                password: "temppassword00",
                user_metadata: params.user_metadata,
                app_metadata: params.app_metadata,
            };
            slice.set(attrs);
            res.status(200).json({ user_id: id, ...attrs });
        },
        ["patch:/v2/users/:id"]: function* (req, res) {
            // let authorizationHeader = req.headers.authorization;
            var _a, _b, _c, _d, _e;
            // assert(!!authorizationHeader, "no authorization header");
            let params = req.body;
            let id = req.params.id;
            let user = personQuery(([, person]) => {
                (0, assert_ts_1.assert)(!!person.id, `no email defined on person scenario`);
                return person.id === id;
            });
            (0, assert_ts_1.assert)(!!user, "no user in /userinfo");
            let attrs = {
                id,
                name: (_a = params.name) !== null && _a !== void 0 ? _a : user.name,
                email: (_b = params.email) !== null && _b !== void 0 ? _b : user.email,
                user_metadata: (_c = params.user_metadata) !== null && _c !== void 0 ? _c : user.user_metadata,
                app_metadata: (_d = params.app_metadata) !== null && _d !== void 0 ? _d : user.app_metadata,
                password: (_e = params.password) !== null && _e !== void 0 ? _e : user.password,
            };
            let people = store.slice("people");
            let slice = people.slice(id);
            slice.update(() => {
                return attrs;
            });
            res.status(200).json({ user_id: id, ...attrs });
        },
    };
};
exports.createAuth0Handlers = createAuth0Handlers;
//# sourceMappingURL=auth0-handlers.js.map