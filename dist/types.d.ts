import type { SimulationState, Store } from "@simulacrum/server";
import type { Slice } from "@effection/atom";
import { z } from "zod";
export declare const configurationSchema: z.ZodObject<{
    port: z.ZodOptional<z.ZodNumber>;
    domain: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodString>;
    clientID: z.ZodOptional<z.ZodString>;
    scope: z.ZodString;
    clientSecret: z.ZodOptional<z.ZodString>;
    rulesDirectory: z.ZodOptional<z.ZodString>;
    auth0SessionCookieName: z.ZodOptional<z.ZodString>;
    auth0CookieSecret: z.ZodOptional<z.ZodString>;
    connection: z.ZodOptional<z.ZodString>;
    cookieSecret: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    port?: number | undefined;
    domain?: string | undefined;
    audience?: string | undefined;
    clientID?: string | undefined;
    clientSecret?: string | undefined;
    rulesDirectory?: string | undefined;
    auth0SessionCookieName?: string | undefined;
    auth0CookieSecret?: string | undefined;
    connection?: string | undefined;
    cookieSecret?: string | undefined;
    scope: string;
}, {
    port?: number | undefined;
    domain?: string | undefined;
    audience?: string | undefined;
    clientID?: string | undefined;
    clientSecret?: string | undefined;
    rulesDirectory?: string | undefined;
    auth0SessionCookieName?: string | undefined;
    auth0CookieSecret?: string | undefined;
    connection?: string | undefined;
    cookieSecret?: string | undefined;
    scope: string;
}>;
export declare type Schema = z.infer<typeof configurationSchema>;
declare type ReadonlyFields = "audience" | "clientID" | "scope" | "port";
export declare type Auth0Configuration = Required<Pick<Schema, ReadonlyFields>> & Omit<Schema, ReadonlyFields>;
export declare type Options = Auth0Configuration & {
    store: Store;
    services: Slice<SimulationState["services"]>;
};
export declare type ResponseModes = "query" | "web_message";
export declare type QueryParams = {
    state: string;
    code: string;
    redirect_uri: string;
    code_challenge: string;
    scope: string;
    client_id: string;
    nonce: string;
    code_challenge_method: string;
    response_type: string;
    response_mode: ResponseModes;
    auth0Client: string;
    audience: string;
};
export interface TokenSet {
    access_token?: string;
    token_type?: string;
    id_token?: string;
    refresh_token?: string;
    scope?: string;
    expires_at?: number;
    session_state?: string;
    [key: string]: unknown;
}
export interface IdTokenData {
    alg: string;
    typ: string;
    iss: string;
    exp: number;
    iat: number;
    aud: string;
    sub?: string;
    nonce?: string;
    email?: string;
}
export interface AccessTokenPayload {
    iss: string;
    aud: string;
    iat: number;
    exp: number;
    scope: string;
    sub?: string;
}
export interface IdToken {
    payload: IdTokenData;
}
export interface AccessToken {
    payload: AccessTokenPayload;
}
export {};
//# sourceMappingURL=types.d.ts.map