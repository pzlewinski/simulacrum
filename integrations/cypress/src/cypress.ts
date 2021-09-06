/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import { Client, createClient, Simulation } from '@simulacrum/client';
import { auth0Client } from './auth';
import { assert } from 'assert-ts';
import { createAtom } from '@effection/atom';
import fetch from 'cross-fetch';

type TestState = Record<string, {
  client: Client;
  simulation?: Simulation;
  person?: Person
}>;


const atom = createAtom<TestState>({});

export interface Person { email: string; password: string }

interface Token {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  access_token: Record<string, any>;
  expires_in: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id_token: Record<string, any>
}

declare global {
  namespace Cypress {
    interface Chainable {
      createSimulation(options: Auth0ClientOptions): Chainable<Simulation>;
      login(person?: Person): Chainable<Token>;
      logout(): Chainable<void>;
      given(attrs?: Partial<Person>): Chainable<Person>;
      out<S = unknown>(msg: string): Chainable<S>
    }
  }
}

const ClientPort = process.env.PORT || 4000;

function getClientFromSpec (spec: string) {
  let client: Client;

  if(!atom.slice(spec).get()) {
    client = createClient(`http://localhost:${ClientPort}`);
    atom.set({ [spec]: { client: client } });
  }

  return atom.slice(spec, 'client').get();
}


Cypress.Commands.add('createSimulation', (options: Auth0ClientOptions) => {
  return new Cypress.Promise((resolve, reject) => {
    console.log('creating simulation');
    let client = getClientFromSpec(Cypress.spec.name);

    let { domain, client_id, ...auth0Options } = options;

    assert(typeof domain !== 'undefined', 'domain is a required option');

    let port = Number(domain.split(':').slice(-1)[0]);

    assert(typeof client !== 'undefined', 'no client created in createSimulation');

    client.createSimulation("auth0", {
      options: {
        ...auth0Options,
        clientId: client_id,
      },
      services: {
        auth0: {
          port,
        },
      },
      key: 'cypress'
    }).then(simulation => {
      atom.slice(Cypress.spec.name).update(current => {
        return {
          ...current,
          simulation
        };
      });

      console.log(`simulation created ${simulation.status}`);

      resolve(simulation);
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
});

Cypress.Commands.add('given', (attrs: Partial<Person> = {}) => {
  return new Cypress.Promise((resolve, reject) => {
    let client = getClientFromSpec(Cypress.spec.name);
    let simulation = atom.slice(Cypress.spec.name, 'simulation').get();

    assert(!!simulation, 'no sumulation in given');

    assert(!!client && typeof client.given === 'function', 'no valid client in given');

    client.given<Person>(simulation, "person", attrs)
      .then((scenario) => {
        atom.slice(Cypress.spec.name).update(current => {
          return {
            ...current,
            person: scenario.data
          };
        });

        console.log(`created ${scenario.data.email}`);
        resolve(scenario.data);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
});

Cypress.Commands.add('login', () => {
  return new Cypress.Promise((resolve, reject) => {
    let person = atom.slice(Cypress.spec.name, 'person').get();

    assert(!!person && typeof person.email !== 'undefined', `no scenario in login`);

    auth0Client.getTokenSilently({ ignoreCache: true, currentUser: person.email })
               .then(() => {
                 console.log('signed in successfully');
                 return resolve();
               })
               .catch((e) => {
                 console.error(e);
                 reject(e);
               });
  });
});

Cypress.Commands.add('logout', () => {
  return new Cypress.Promise((resolve, reject) => {
    auth0Client.isAuthenticated().then((isAuthenticated) => {
      console.log({ isAuthenticated });
      if(!isAuthenticated) {
        resolve();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth0Client as any).cacheManager.clearSync();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (auth0Client as any).cookieStorage.remove('auth0.is.authenticated');

      return fetch(`https://${Cypress.env('domain')}/internal/clear`, {
        method: 'DELETE'
      });
    }).then(() => {
      let client = getClientFromSpec(Cypress.spec.name);

      let simulation = atom.slice(Cypress.spec.name, 'simulation').get();

      if(!client || !simulation) {
        console.log('no client or simulation');
        resolve();
        return;
      }

      return client.destroySimulation(simulation).then(() => {
        atom.slice(Cypress.spec.name).remove();

        console.log('we are finished');
        resolve();
      });
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
});

export { };
