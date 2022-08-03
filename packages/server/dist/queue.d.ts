interface Queue<T> {
    push(value: T): void;
    pop(): Promise<T>;
}
export declare function createQueue<T>(): Queue<T>;
export {};
//# sourceMappingURL=queue.d.ts.map