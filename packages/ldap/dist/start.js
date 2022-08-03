"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const effection_1 = require("effection");
const server_1 = require("@simulacrum/server");
const _1 = require(".");
const dedent_1 = __importDefault(require("dedent"));
const client_1 = require("@simulacrum/client");
const port = process.env.PORT ? parseInt(process.env.PORT) : undefined;
(0, effection_1.main)(function* () {
    let server = yield (0, server_1.createSimulationServer)({
        debug: true,
        seed: 1,
        port,
        simulators: { ldap: _1.ldap }
    });
    let url = `http://localhost:${server.address.port}`;
    console.log((0, dedent_1.default) `Started Simulacrum simulation server on ${url}. 
  GraphiQL interface is running on ${url}/graphql.
  
  To start ldap simulator send the following mutation to the GraphQL server.
  
  mutation CreateSimulation {
    createSimulation(simulator: "ldap",
     options: {
       options:{
         baseDN: "ou=users,dc=org.com",
         bindDn: "admin@org.com",
         bindPassword: "password",
         groupDN:"ou=groups,dc=org.com"
       },
       services:{
         ldap:{
           port: 389
         }
       }
     }) {
       id
       status
       services {
         url
         name
       }
     }
   }
 `);
    let client = (0, client_1.createClient)(url);
    yield client.createSimulation("ldap", {
        options: {
            baseDN: "ou=users,dc=org.com",
            bindDn: "admin@org.com",
            bindPassword: "password",
            groupDN: "ou=groups,dc=org.com"
        },
        services: {
            ldap: {
                port: 389
            }
        }
    });
    yield;
});
//# sourceMappingURL=start.js.map