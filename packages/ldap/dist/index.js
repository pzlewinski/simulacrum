"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ldap = exports.createLdapService = exports.runLDAPServer = exports.createLDAPServer = void 0;
const effection_1 = require("effection");
const ldapjs_1 = require("ldapjs");
const dedent_1 = __importDefault(require("dedent"));
const server_1 = require("@simulacrum/server");
const effection_2 = require("effection");
const get_port_1 = __importDefault(require("get-port"));
const DefaultOptions = {
    port: 389
};
function createLDAPServer(options) {
    return {
        name: 'LDAPServer',
        *init() {
            var _a;
            let port = (_a = options.port) !== null && _a !== void 0 ? _a : (yield (0, get_port_1.default)());
            let baseDN = options.baseDN;
            let bindDn = options.bindDn;
            let bindPassword = options.bindPassword;
            let groupDN = options.groupDN;
            let silence = {
                debug: () => undefined,
                trace: () => undefined,
                warn: () => undefined,
                error: () => undefined,
            };
            let logger = options.log || options.log == null ? console : {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                log: (..._) => { }
            };
            let server = (0, ldapjs_1.createServer)({ log: silence });
            server.search("", function (req, res, next) {
                logger.log((0, dedent_1.default) `--- Root DSE ---
        scope:  ${req.scope}
        `);
                res.send({
                    dn: "",
                    attributes: {
                        "vendorName": "Frontside, Inc."
                    },
                });
                res.end();
                return next();
            });
            server.search(baseDN, function (req, res, next) {
                logger.log((0, dedent_1.default) `--- User Search ---
dn:     ${req.dn.toString()}
scope:  ${req.scope}
filter: ${req.filter.toString()}
`);
                let users = [...options.users];
                for (let entry of users) {
                    let groups = [`cn=users,${groupDN}`];
                    let dn = `cn=${entry.cn},${baseDN}`;
                    let user = {
                        dn,
                        attributes: {
                            entryUUID: entry.uuid,
                            entryDN: dn,
                            objectclass: ['user'],
                            ...entry,
                            memberof: groups,
                        },
                    };
                    if (req.filter.matches(user.attributes)) {
                        logger.log(`Sending ${user.dn}`);
                        res.send(user);
                    }
                }
                res.end();
                return next();
            });
            server.compare(groupDN, (req, res) => {
                logger.log('--- Compare ---');
                logger.log(`DN: ${req.dn.toString()}`);
                logger.log(`attribute name: ${req.attribute}`);
                logger.log(`attribute value: ${req.value}`);
                res.end(0);
            });
            server.bind(baseDN, function (req, res, next) {
                var _a;
                logger.log('--- Bind ---');
                logger.log(`bind DN: ${req.dn.toString()}`);
                logger.log(`bind PW: ${req.credentials}`);
                let commonName = req.dn.rdns[0].attrs.cn.value;
                if (!commonName) {
                    return next(new ldapjs_1.NoSuchObjectError(req.dn.toString()));
                }
                let password = req.credentials;
                logger.log('verify:', commonName, password);
                let users = [...options.users];
                let user = (_a = users.filter(u => u.cn === commonName)) === null || _a === void 0 ? void 0 : _a[0];
                if (typeof user === 'undefined') {
                    logger.log('could not find user');
                    return next(new ldapjs_1.NoSuchObjectError(req.dn.toString()));
                }
                if (user.password !== password) {
                    logger.log(`bad password ${password} for ${user.cn}`);
                    return next(new ldapjs_1.InvalidCredentialsError(req.dn.toString()));
                }
                if (commonName === bindDn && password === bindPassword) {
                    logger.log(`bind succeeded for ${bindDn}`);
                    res.end();
                }
                else {
                    return next(new ldapjs_1.OperationsError('could not find user'));
                }
            });
            server.listen(port, function () {
                logger.log((0, dedent_1.default) `LDAP test server running on port ${port});

BindDN: bindDn = ${bindDn} cn=${bindDn},${baseDN}
Bind Password: ${bindPassword}

UserBaseDN:    ${bindDn}
`);
            });
            yield (0, effection_2.spawn)(function* shutdown() {
                try {
                    yield;
                }
                finally {
                    yield new Promise(resolve => {
                        server === null || server === void 0 ? void 0 : server.close(() => {
                            logger.log('ldap server closed');
                            resolve();
                        });
                    });
                }
            });
            return { ...server, port };
        }
    };
}
exports.createLDAPServer = createLDAPServer;
/**
 * Wraps an LDAP server resource into an Promise based API
 */
async function runLDAPServer(options) {
    let task = (0, effection_1.run)(createLDAPServer(options));
    let server = await task;
    return Object.create(server, {
        close: { value: () => task.halt() }
    });
}
exports.runLDAPServer = runLDAPServer;
function createLdapService(options, state) {
    return () => {
        let users = {
            *[Symbol.iterator]() {
                var _a;
                let entries = (_a = state.slice('store', 'people').get()) !== null && _a !== void 0 ? _a : [];
                for (let user of Object.values(entries)) {
                    yield { ...user, uuid: user.id, cn: user.email };
                }
            }
        };
        return {
            name: 'LDAPService',
            *init() {
                let server = yield createLDAPServer({
                    ...options,
                    users
                });
                return {
                    port: server.port,
                    protocol: 'ldap',
                };
            }
        };
    };
}
exports.createLdapService = createLdapService;
const ldap = (slice, options) => {
    let ldapOptions = { ...DefaultOptions, ...options };
    return {
        services: {
            ldap: createLdapService(ldapOptions, slice),
        },
        scenarios: {
            person: server_1.person
        }
    };
};
exports.ldap = ldap;
//# sourceMappingURL=index.js.map