import type { HttpHandler } from "@simulacrum/server";
import type { Options } from "../types";
export declare type Routes = "/heartbeat" | "/authorize" | "/login" | "/usernamepassword/login" | "/login/callback" | "/oauth/token" | "/v2/logout" | "/userinfo" | "get:/v2/users/:id" | "get:/v2/users" | "patch:/v2/users/:id" | "post:/v2/users";
export declare const createAuth0Handlers: (options: Options) => Record<Routes, HttpHandler>;
//# sourceMappingURL=auth0-handlers.d.ts.map