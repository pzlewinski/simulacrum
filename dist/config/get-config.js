"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.getConfigCreator = exports.DefaultArgs = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const types_1 = require("../types");
function omit(obj, ...keys) {
    let copy = {};
    let remaining = Object.keys(obj)
        .flatMap(c => keys.includes(c) === false ? [c] : []);
    for (let k of remaining) {
        copy[k] = obj[k];
    }
    return copy;
}
const DefaultAuth0Port = 4400;
exports.DefaultArgs = {
    clientID: '00000000000000000000000000000000',
    audience: 'https://thefrontside.auth0.com/api/v1/',
    scope: "openid profile email offline_access",
};
function getPort({ domain, port }) {
    if (typeof port === 'number') {
        return port;
    }
    if (domain) {
        if (domain.split(':').length === 2) {
            return parseInt(domain.split(':')[1]);
        }
    }
    return DefaultAuth0Port;
}
// This higher order function would only be used for testing and
// allows different cosmiconfig instances to be used for testing
function getConfigCreator(explorer) {
    return function getConfig(options) {
        let searchResult = explorer.search();
        let config = searchResult === null ? exports.DefaultArgs : searchResult.config;
        let strippedOptions = !!options ? omit(options, 'store', 'services') : {};
        let configuration = { ...exports.DefaultArgs, ...config, ...strippedOptions };
        configuration.port = getPort(configuration);
        types_1.configurationSchema.parse(configuration);
        return configuration;
    };
}
exports.getConfigCreator = getConfigCreator;
const explorer = (0, cosmiconfig_1.cosmiconfigSync)("auth0Simulator");
exports.getConfig = getConfigCreator(explorer);
//# sourceMappingURL=get-config.js.map