"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceUrl = void 0;
const assert_ts_1 = require("assert-ts");
const getServiceUrl = (options) => {
    let service = options.services.get().find(({ name }) => name === 'auth0');
    (0, assert_ts_1.assert)(!!service, `did not find auth0 service in set of running services`);
    return new URL(service.url);
};
exports.getServiceUrl = getServiceUrl;
//# sourceMappingURL=get-service-url.js.map