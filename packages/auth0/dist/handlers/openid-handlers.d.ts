import type { HttpHandler } from '@simulacrum/server';
import type { Options } from 'src/types';
declare type Routes = '/jwks.json' | '/openid-configuration';
export declare type OpenIdRoutes = `${`/.well-known`}${Routes}`;
export interface OpenIdConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    jwks_uri: string;
}
export declare const createOpenIdHandlers: (options: Options) => Record<OpenIdRoutes, HttpHandler>;
export {};
//# sourceMappingURL=openid-handlers.d.ts.map