"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.person = void 0;
const uuid_1 = require("uuid");
function default_1() {
    return {
        services: {},
        scenarios: { person },
    };
}
exports.default = default_1;
// export type OptionalParams<T extends { id: string }> = Partial<Omit<T, 'id'>>;
function person(store, faker, params = {}) {
    return function* () {
        var _a, _b, _c, _d;
        let id = (_a = params.id) !== null && _a !== void 0 ? _a : "auth0|" + (0, uuid_1.v4)().replace(/-/g, "").slice(0, 24);
        let slice = records(store).slice(id);
        let name = (_b = params.name) !== null && _b !== void 0 ? _b : faker.name.findName();
        // this is the lamest data generation ever :)
        let attrs = {
            id,
            name,
            email: (_c = params.email) !== null && _c !== void 0 ? _c : faker.internet.email(name).toLowerCase(),
            password: (_d = params.password) !== null && _d !== void 0 ? _d : faker.internet.password(),
            user_metadata: params.user_metadata,
            app_metadata: params.app_metadata,
        };
        slice.set(attrs);
        return attrs;
    };
}
exports.person = person;
function records(store) {
    let people = store.slice("people");
    // atom doesn't quite work right in the sense that we can't make a
    // deep slice and have it create parents on demand.
    if (!people.get()) {
        people.set({});
    }
    return people;
}
//# sourceMappingURL=person.js.map