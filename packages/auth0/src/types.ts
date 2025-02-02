import type { SimulationState, Store } from "@simulacrum/server";
import type { Slice } from "@effection/atom";
import { z } from "zod";

// TODO: better validation
export const configurationSchema = z.object({
  port: z.optional(
    z
      .number()
      .gt(2999, "port must be greater than 2999")
      .lt(10000, "must be less than 10000")
  ),
  domain: z.optional(z.string().min(1, "domain is required")),
  audience: z.optional(z.string().min(1, "audience is required")),
  clientID: z.optional(z.string().max(32, "must be 32 characters long")),
  scope: z.string().min(1, "scope is required"),
  clientSecret: z.optional(z.string()),
  rulesDirectory: z.optional(z.string()),
  auth0SessionCookieName: z.optional(z.string()),
  auth0CookieSecret: z.optional(z.string()),
  connection: z.optional(z.string()),
  cookieSecret: z.optional(z.string()),
});

export type Schema = z.infer<typeof configurationSchema>;

type ReadonlyFields = "audience" | "clientID" | "scope" | "port";

export type Auth0Configuration = Required<Pick<Schema, ReadonlyFields>> &
  Omit<Schema, ReadonlyFields>;

export type Options = Auth0Configuration & {
  store: Store;
  services: Slice<SimulationState["services"]>;
};

export type ResponseModes = "query" | "web_message";

export type QueryParams = {
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

  // [key: string]: string | number | string[];
}

export interface IdToken {
  payload: IdTokenData;
}

export interface AccessToken {
  payload: AccessTokenPayload;
}
