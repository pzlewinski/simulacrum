import type { Task } from 'effection';
import type { ServerState, Simulator } from './interfaces';
import type { OperationContext } from './schema/context';
import type { v4 } from 'uuid';
import type { Slice } from '@effection/atom';
declare type NewId = (() => string) | typeof v4;
export declare function createOperationContext(atom: Slice<ServerState>, scope: Task, newid: NewId, simulators: Record<string, Simulator>): OperationContext;
export {};
//# sourceMappingURL=operation-context.d.ts.map