import type { SimulationState, ScenarioState, ServerState, SimulationOptions } from "../interfaces";
import type { OperationContext } from "./context";
export interface Resolver<Args, Result> {
    resolve(args: Args, context: OperationContext): Promise<Result>;
}
export interface Subscriber<Args, TEach, Result = TEach> {
    subscribe(args: Args, context: OperationContext): AsyncIterable<TEach>;
    resolve?(each: TEach): Result;
}
export interface CreateSimulationParameters {
    simulator: string;
    options?: SimulationOptions;
    debug?: boolean;
}
export declare const createSimulation: Resolver<CreateSimulationParameters, SimulationState>;
export declare const destroySimulation: Resolver<{
    id: string;
}, boolean>;
export interface GivenParameters {
    a: string;
    simulation: string;
    params: Record<string, unknown>;
}
export declare const given: Resolver<GivenParameters, ScenarioState>;
interface StateParameters {
    path: string;
}
export declare const state: Subscriber<StateParameters, ServerState>;
export {};
//# sourceMappingURL=resolvers.d.ts.map