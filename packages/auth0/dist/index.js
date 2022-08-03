"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth0 = exports.getConfig = void 0;
const server_1 = require("@simulacrum/server");
const server_2 = require("@simulacrum/server");
const express_1 = require("express");
const auth0_handlers_1 = require("./handlers/auth0-handlers");
const server_3 = require("@simulacrum/server");
const session_1 = require("./middleware/session");
const path_1 = __importDefault(require("path"));
const express_2 = __importDefault(require("express"));
const create_cors_1 = require("./middleware/create-cors");
const no_cache_1 = require("./middleware/no-cache");
const openid_handlers_1 = require("./handlers/openid-handlers");
const get_config_1 = require("./config/get-config");
var get_config_2 = require("./config/get-config");
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return get_config_2.getConfig; } });
const publicDir = path_1.default.join(__dirname, "views", "public");
const createAuth0Service = (handlers, { port, debug }) => {
    let app = (0, server_2.createHttpApp)()
        .use(express_2.default.static(publicDir))
        .use((0, session_1.createSession)())
        .use((0, create_cors_1.createCors)())
        .use((0, no_cache_1.noCache)())
        .use((0, express_1.json)())
        .use((0, express_1.urlencoded)({ extended: true }))
        .get("/heartbeat", handlers["/heartbeat"])
        .get("/authorize", handlers["/authorize"])
        .get("/login", handlers["/login"])
        .get("/u/login", handlers["/usernamepassword/login"])
        .post("/usernamepassword/login", handlers["/usernamepassword/login"])
        .post("/login/callback", handlers["/login/callback"])
        .post("/oauth/token", handlers["/oauth/token"])
        .get("/userinfo", handlers["/userinfo"])
        .get("/v2/logout", handlers["/v2/logout"])
        .get("/api/v2/users/:id", handlers["get:/v2/users/:id"])
        .get("/api/v2/users", handlers["get:/v2/users"])
        .post("/api/v2/users", handlers["post:/v2/users"])
        .patch("/api/v2/users/:id", handlers["patch:/v2/users/:id"])
        .get("/.well-known/jwks.json", handlers["/.well-known/jwks.json"])
        .get("/.well-known/openid-configuration", handlers["/.well-known/openid-configuration"]);
    if (debug) {
        app = app.use(server_1.consoleLogger);
    }
    return {
        protocol: "https",
        app,
        port,
    };
};
const auth0 = (slice, options) => {
    let store = slice.slice("store");
    let services = slice.slice("services");
    let debug = !!slice.slice("debug").get();
    let config = (0, get_config_1.getConfig)(options);
    let handlersOptions = { ...config, store, services };
    let auth0Handlers = (0, auth0_handlers_1.createAuth0Handlers)(handlersOptions);
    let openIdHandlers = (0, openid_handlers_1.createOpenIdHandlers)(handlersOptions);
    let serviceOptions = { debug, port: config.port };
    return {
        services: {
            auth0: createAuth0Service({ ...auth0Handlers, ...openIdHandlers }, serviceOptions),
        },
        scenarios: {
            /**
             * Here we just export the internal `person` scenario so that it can be
             * used with the a standalone auth0 simulator. However,
             * what we really need to have some way to _react_ to the person
             * having been created and augment the record at that point.
             */
            person: server_3.person,
        },
    };
};
exports.auth0 = auth0;
//# sourceMappingURL=index.js.map