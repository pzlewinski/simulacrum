import type { Server } from 'ldapjs';
import type { Operation } from 'effection';
import type { LDAPOptions, LDAPStoreOptions, Port, UserData } from './types';
import type { SimulationState, Simulator } from '@simulacrum/server';
import type { ResourceServiceCreator } from '@simulacrum/server';
import type { Slice } from '@effection/atom';
export interface NextFunction {
    <E>(err?: E): void;
}
export declare function createLDAPServer<T extends UserData>(options: LDAPOptions & LDAPStoreOptions<T>): Operation<Server & Port>;
export interface Close {
    close(): Promise<void>;
}
/**
 * Wraps an LDAP server resource into an Promise based API
 */
export declare function runLDAPServer<T extends UserData>(options: LDAPOptions & LDAPStoreOptions<T>): Promise<Server & Port & Close>;
export declare function createLdapService<T extends UserData>(options: LDAPOptions, state: Slice<SimulationState>): ResourceServiceCreator;
export declare const ldap: Simulator<LDAPOptions>;
//# sourceMappingURL=index.d.ts.map