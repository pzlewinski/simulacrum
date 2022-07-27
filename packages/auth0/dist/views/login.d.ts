interface LoginViewProps {
    domain: string;
    scope: string;
    redirectUri: string;
    clientID: string;
    audience: string;
    loginFailed: boolean;
}
export declare const loginView: ({ domain, scope, redirectUri, clientID, audience, loginFailed }: LoginViewProps) => string;
export {};
//# sourceMappingURL=login.d.ts.map