"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpApp = exports.createServer = void 0;
const effection_1 = require("effection");
const https_1 = require("https");
const http_1 = require("http");
const paths_1 = require("./config/paths");
const fs_1 = __importDefault(require("fs"));
const ssl_error_1 = require("./errors/ssl/ssl-error");
const createAppServer = (app, options) => {
    switch (options.protocol) {
        case "http":
            return (0, http_1.createServer)(app);
        case "https":
            if ([paths_1.paths.ssl.keyFile, paths_1.paths.ssl.pemFile].some((f) => !fs_1.default.existsSync(f))) {
                console.warn(ssl_error_1.mkcertText);
                throw new ssl_error_1.NoSSLError("no self signed certificate.");
            }
            // mkcert does not generate a fullchain certificate
            // https://github.com/FiloSottile/mkcert/issues/76
            // one solution is to monkey patch secureContext
            // https://medium.com/trabe/monkey-patching-tls-in-node-js-to-support-self-signed-certificates-with-custom-root-cas-25c7396dfd2a
            let ssl = {
                key: fs_1.default.readFileSync(paths_1.paths.ssl.keyFile),
                cert: fs_1.default.readFileSync(paths_1.paths.ssl.pemFile),
            };
            return (0, https_1.createServer)(ssl, app);
    }
};
function createServer(app, options) {
    return {
        name: "http-server",
        labels: { protocol: options.protocol },
        *init() {
            let server = createAppServer(app, options);
            yield (0, effection_1.spawn)(function* () {
                let error = yield (0, effection_1.once)(server, "error");
                throw error;
            });
            server.listen(options.port);
            yield (0, effection_1.spawn)(function* () {
                try {
                    yield;
                }
                finally {
                    let { future, resolve, reject } = (0, effection_1.createFuture)();
                    server.close((err) => (err ? reject(err) : resolve()));
                    yield future;
                }
            });
            if (!server.listening) {
                yield (0, effection_1.once)(server, "listening");
            }
            let address = server.address();
            yield (0, effection_1.label)({ port: address.port });
            return {
                http: server,
                address,
            };
        },
    };
}
exports.createServer = createServer;
function createHttpApp(handlers = [], middleware = []) {
    function appendHandler(routeHandler) {
        return createHttpApp(handlers.concat(routeHandler), middleware);
    }
    function appendMiddleware(middlewareHandler) {
        return createHttpApp(handlers, middleware.concat(middlewareHandler));
    }
    return {
        handlers,
        middleware: middleware,
        get: (path, handler) => appendHandler({ path, handler, method: "get" }),
        post: (path, handler) => appendHandler({ path, handler, method: "post" }),
        put: (path, handler) => appendHandler({ path, handler, method: "put" }),
        patch: (path, handler) => appendHandler({ path, handler, method: "patch" }),
        use: (middlewareHandler) => appendMiddleware(middlewareHandler),
    };
}
exports.createHttpApp = createHttpApp;
//# sourceMappingURL=http.js.map