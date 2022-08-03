import type { Operation } from "effection";
import type { Faker } from "../faker";
import type { Behaviors, Store } from "../interfaces";
export default function (): Behaviors;
export interface AppMetadata {
    location: Array<string>;
    roles: Array<string>;
}
export interface Person {
    id: string;
    name: string;
    email?: string;
    password?: string;
    picture?: string;
    user_metadata?: Record<string, undefined>;
    app_metadata?: AppMetadata;
}
export declare function person(store: Store, faker: Faker, params?: Partial<Person>): Operation<Person>;
//# sourceMappingURL=person.d.ts.map