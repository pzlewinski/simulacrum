import { cosmiconfigSync } from 'cosmiconfig';
import type { Auth0Configuration, Options, Schema } from '../types';
export declare const DefaultArgs: Schema;
declare type Explorer = ReturnType<typeof cosmiconfigSync>;
export declare function getConfigCreator(explorer: Explorer): (options?: Options | undefined) => Auth0Configuration;
export declare const getConfig: (options?: Options | undefined) => Auth0Configuration;
export {};
//# sourceMappingURL=get-config.d.ts.map