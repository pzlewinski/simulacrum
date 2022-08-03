"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = exports.given = exports.destroySimulation = exports.createSimulation = void 0;
const resolvers = __importStar(require("./resolvers"));
exports.createSimulation = uncover(resolvers.createSimulation);
exports.destroySimulation = uncover(resolvers.destroySimulation);
exports.given = uncover(resolvers.given);
exports.state = uncover(resolvers.state);
function uncover(subject) {
    if (isSubscriber(subject)) {
        return {
            subscribe(_, args, context) {
                return subject.subscribe(args, context);
            },
            resolve: (value) => subject.resolve ? subject.resolve(value) : value
        };
    }
    else {
        return {
            resolve(_, args, context) {
                return subject.resolve(args, context);
            }
        };
    }
}
function isSubscriber(subject) {
    return subject.subscribe !== undefined;
}
//# sourceMappingURL=operations.js.map