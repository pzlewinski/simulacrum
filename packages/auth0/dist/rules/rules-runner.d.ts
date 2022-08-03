import type { RuleContext, RuleUser } from './types';
export declare type RulesRunner = <A, I>(user: RuleUser, context: RuleContext<A, I>) => void;
export declare function createRulesRunner(rulesPath?: string): RulesRunner;
//# sourceMappingURL=rules-runner.d.ts.map