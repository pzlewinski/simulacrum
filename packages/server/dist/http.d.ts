/// <reference types="node" />
import type { AddressInfo } from "net";
import type { LegacyServiceCreator } from "./interfaces";
import type { Operation, Resource } from "effection";
import type { Request, Response, Application, RequestHandler } from "express";
import type { Server as HTTPServer } from "http";
export interface Server {
    http: HTTPServer;
    address: AddressInfo;
}
export interface ServerOptions {
    port?: number;
    protocol: LegacyServiceCreator["protocol"];
}
export declare function createServer(app: Application, options: ServerOptions): Resource<Server>;
export interface HttpHandler {
    (request: Request, response: Response): Operation<void>;
}
export declare type RouteHandler = {
    method: "get" | "post" | "put" | "patch";
    path: string;
    handler: HttpHandler;
};
export interface Middleware {
    (req: Request, res: Response): Operation<void>;
}
export interface HttpApp {
    handlers: RouteHandler[];
    middleware: (Middleware | RequestHandler)[];
    get(path: string, handler: HttpHandler): HttpApp;
    put(path: string, handler: HttpHandler): HttpApp;
    patch(path: string, handler: HttpHandler): HttpApp;
    post(path: string, handler: HttpHandler): HttpApp;
    use(middleware: Middleware | RequestHandler): HttpApp;
}
export declare function createHttpApp(handlers?: RouteHandler[], middleware?: (Middleware | RequestHandler)[]): HttpApp;
//# sourceMappingURL=http.d.ts.map