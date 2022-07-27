import type { Operation, Task } from 'effection';
import type { Effect } from './effect';
import type { SimulationState, Simulator } from './interfaces';
import type { Slice } from '@effection/atom';
export declare function createSimulation(slice: Slice<SimulationState>, simulators: Record<string, Simulator>): Operation<Task<void>>;
export declare function simulation(simulators: Record<string, Simulator>): Effect<SimulationState>;
//# sourceMappingURL=simulation.d.ts.map