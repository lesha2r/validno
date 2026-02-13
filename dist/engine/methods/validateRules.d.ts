import ValidnoResult from "../ValidnoResult.js";
import { SchemaDefinition } from "../../types/common.js";
export interface ValidateRulesInput {
    results: ValidnoResult;
    nestedKey: string;
    value: any;
    reqs: SchemaDefinition;
    data: any;
    rulesChecked: boolean[];
}
export type Rule = Record<string, any>;
export declare const rulesParams: {
    lengthMin: {
        allowedTypes: StringConstructor[];
    };
};
declare function validateRules(input: ValidateRulesInput): void;
export default validateRules;
//# sourceMappingURL=validateRules.d.ts.map