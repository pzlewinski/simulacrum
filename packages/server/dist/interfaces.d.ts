import type { Operation, Resource } from 'effection';
import type { Slice } from '@effection/atom';
import type { HttpApp } from './http';
import type { Faker } from './faker';
export interface Behaviors {
    services: Record<string, ServiceCreator>;
    scenarios: Record<string, Scenario>;
    effects?: () => Operation<void>;
}
export declare type Params = Record<string, unknown>;
export interface Scenario<T = any, P extends Params = Params> {
    (store: Store, faker: Faker, params: P): Operation<T>;
}
export interface Simulator<Options = any> {
    (state: Slice<SimulationState>, options: Options): Behaviors;
}
export interface ServerOptions {
    simulators: Record<string, Simulator<any>>;
    port?: number;
    seed?: number;
    debug?: boolean;
}
export interface LegacyServiceCreator {
    protocol: 'http' | 'https';
    app: HttpApp;
    port?: number;
}
export interface Service {
    port: number;
    protocol: string;
}
export interface ServiceOptions {
    port?: number;
}
export declare type ResourceServiceCreator = (slice: Slice<SimulationState>, options: ServiceOptions) => Resource<Service>;
export declare type ServiceCreator = ResourceServiceCreator | LegacyServiceCreator;
export declare type StoreState = Record<string, Record<string, Record<string, any>>>;
export declare type Store = Slice<StoreState>;
export interface ServerState {
    debug: boolean;
    simulations: Record<string, SimulationState>;
}
export interface SimulationOptions {
    options?: Record<string, unknown>;
    services?: Record<string, ServiceOptions>;
    key?: string;
}
export declare type SimulationState = {
    id: string;
    status: 'new';
    debug?: boolean;
    simulator: string;
    options: SimulationOptions;
    scenarios: Record<string, ScenarioState>;
    services: [];
    store: StoreState;
} | {
    id: string;
    status: 'running';
    simulator: string;
    debug?: boolean;
    options: SimulationOptions;
    services: {
        name: string;
        url: string;
    }[];
    scenarios: Record<string, ScenarioState>;
    store: StoreState;
} | {
    id: string;
    status: 'failed';
    simulator: string;
    debug?: boolean;
    options: SimulationOptions;
    scenarios: Record<string, ScenarioState>;
    services: [];
    store: StoreState;
    error: Error;
} | {
    id: string;
    status: 'destroying';
    simulator: string;
    debug?: boolean;
    options: SimulationOptions;
    scenarios: Record<string, ScenarioState>;
    services: [];
    store: StoreState;
    error: Error;
} | {
    id: string;
    status: 'halted';
    simulator: string;
    debug?: boolean;
    options: SimulationOptions;
    scenarios: Record<string, ScenarioState>;
    services: [];
    store: StoreState;
    error: Error;
};
export declare type ScenarioState = {
    id: string;
    name: string;
    status: 'new';
    params: Params;
} | {
    id: string;
    name: string;
    status: 'running';
    params: Params;
} | {
    id: string;
    name: string;
    status: "failed";
    params: Params;
    error: Error;
};
export declare type SimulationStatus = SimulationState['status'];
export interface Server {
    port: number;
}
//# sourceMappingURL=interfaces.d.ts.map