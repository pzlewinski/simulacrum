"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const effection_1 = require("effection");
const server_1 = require("@simulacrum/server");
const _1 = require(".");
const dedent_1 = __importDefault(require("dedent"));
const client_1 = require("@simulacrum/client");
const port = process.env.PORT ? parseInt(process.env.PORT) : undefined;
const args = process.argv.slice(2);
const isStandAlone = args.indexOf('--standalone') >= 0;
const userName = (_a = args.find(arg => arg.startsWith('--username='))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
const password = (_b = args.find(arg => arg.startsWith('--password='))) === null || _b === void 0 ? void 0 : _b.split('=')[1];
function* startInStandAloneMode(url) {
    let client = (0, client_1.createClient)(url);
    try {
        let simulation = yield client.createSimulation("auth0");
        let person = yield client.given(simulation, "person", {
            email: userName,
            password
        });
        console.log(`store populated with user`);
        console.log(`username = ${person.data.email} password = ${person.data.password}`);
    }
    finally {
        client.dispose();
    }
}
(0, effection_1.main)(function* () {
    let server = yield (0, server_1.createSimulationServer)({
        debug: true,
        seed: 1,
        port,
        simulators: { auth0: _1.auth0 }
    });
    let url = `http://localhost:${server.address.port}`;
    console.log(`Started Simulacrum simulation server on ${url}.`);
    if (isStandAlone) {
        console.log('starting in standalone mode');
        yield startInStandAloneMode(url);
    }
    else {
        console.log((0, dedent_1.default) ` 
    GraphiQL interface is running on ${url}/graphql.
    
    To start auth0 simulator send the following mutation to GraphQL server.
    
    mutation CreateSimulation {
     createSimulation(simulator: "auth0",
      options: {
        options:{
          audience: "[your audience]",
          scope: "[your scope]",
          clientID: "[your client-id]"
        },
        services:{
          auth0:{
            port: 4400
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
    }
    yield;
});
//# sourceMappingURL=start.js.map