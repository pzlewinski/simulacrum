export interface SimulationOptions {
    options?: Record<string, unknown>;
    services?: Record<string, {
        port?: number;
    }>;
    key?: string;
    debug?: boolean;
}
export interface Client {
    createSimulation(simulator: string, options?: SimulationOptions): Promise<Simulation>;
    destroySimulation(simulation: Simulation): Promise<boolean>;
    given<T>(simulation: Simulation, scenario: string, params?: Record<string, unknown>): Promise<Scenario<T>>;
    state<T>(): AsyncIterable<T> & AsyncIterator<T>;
    dispose(): Promise<void>;
}
export interface Simulation {
    id: string;
    status: 'new' | 'running' | 'failed';
    services: Service[];
}
export interface WebSocketImpl {
    new (url: string): {
        send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    };
}
export interface Scenario<T = unknown> {
    id: string;
    status: 'running' | 'failed';
    data: T;
}
export interface Service {
    name: string;
    url: string;
}
export declare function createClient(serverURL: string): Client;
//# sourceMappingURL=index.d.ts.map