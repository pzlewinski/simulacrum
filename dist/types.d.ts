/// <reference types="node" />
declare module 'ldapjs' {
    interface RDNS {
        attrs: {
            [key: string]: any;
        };
    }
    interface DN {
        rdns: RDNS[];
    }
    interface SearchRequest {
        dn: DN;
    }
    interface LDAPResult {
        end(status?: number): void;
    }
    interface SearchResponse extends LDAPResult {
        send(entry: SearchEntry | SearchReference, noFiltering?: boolean): void;
    }
    interface CompareRequest {
        entry: SearchEntry;
        attribute: Attribute;
        value: string | Buffer;
        dn: DN;
    }
    type CompareResponse = LDAPResult;
    type BindResponse = LDAPResult;
    interface BindRequest {
        credentials: string;
        dn: DN;
    }
}
export interface LDAPOptions {
    log?: boolean;
    port?: number;
    baseDN: string;
    bindDn: string;
    groupDN: string;
    bindPassword: string;
}
export interface UserData {
    uuid: string;
    cn: string;
    password: string;
}
export interface LDAPStoreOptions<T extends UserData> {
    users: Iterable<T>;
}
export interface Port {
    port: number;
}
//# sourceMappingURL=types.d.ts.map