import type { QueryParams } from '../types';
export declare type UserNamePasswordForm = {
    auth0Domain?: string;
    audience?: string;
    connection?: string;
    response_type?: string;
    tenant: string;
} & Partial<QueryParams>;
export declare const userNamePasswordForm: ({ auth0Domain, redirect_uri, state, nonce, client_id, scope, audience, connection, response_type, tenant, }: UserNamePasswordForm) => string;
//# sourceMappingURL=username-password.d.ts.map