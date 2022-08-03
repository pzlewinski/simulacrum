import type { ServerOptions } from './interfaces';
import type { Server } from './http';
export { Server, createServer } from './http';
import type { Resource } from 'effection';
export declare function createSimulationServer(options?: ServerOptions): Resource<Server>;
//# sourceMappingURL=server.d.ts.map