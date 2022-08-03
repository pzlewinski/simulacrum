import type { Slice } from "@effection/atom";
import type { Operation } from "effection";
export interface Effect<A> {
    (slice: Slice<A>): Operation<void>;
}
export declare function map<A>(slice: Slice<Record<string, A>>, effect: Effect<A>): Operation<void>;
//# sourceMappingURL=effect.d.ts.map