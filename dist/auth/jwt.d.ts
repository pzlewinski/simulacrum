import type { SignOptions } from "jsonwebtoken";
export declare const parseKey: (key: string) => string;
export declare const createJsonWebToken: (payload: Record<string, unknown>, privateKey?: string, options?: SignOptions) => string;
//# sourceMappingURL=jwt.d.ts.map