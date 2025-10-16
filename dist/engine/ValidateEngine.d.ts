import { Schema } from "../Schema.js";
import ValidnoResult from "./ValidnoResult.js";
import { SchemaDefinition } from "../types/common.js";
import { ValidateValueInput } from "./methods/validateType.js";
import { ValidateRulesInput } from "./methods/validateRules.js";
import { HandleMissingKeyValidationParams } from "./methods/handleMissingKeyValidation.js";
import { FinalizeValidationInput } from "./methods/finishValidation.js";
export interface KeyValidationDetails {
    results: ValidnoResult;
    key: string;
    data: any;
    reqs: SchemaDefinition;
    nestedKey: string;
}
declare class ValidateEngine {
    definition: SchemaDefinition;
    result: ValidnoResult;
    constructor(definition: SchemaDefinition);
    validate(data: any, validationKeys?: string | string[]): ValidnoResult;
    handleKey(input: KeyValidationDetails): ValidnoResult;
    handleNestedKey(input: KeyValidationDetails): ValidnoResult;
    handleMissingKey(schema: Schema, input: KeyValidationDetails): any;
    handleMissingNestedKey(nestedKey: string, results: ValidnoResult): ValidnoResult;
    handleMissingKeyValidation(params: HandleMissingKeyValidationParams): ValidnoResult;
    validateType(input: ValidateValueInput): void;
    validateRules(input: ValidateRulesInput): void;
    finishValidation(checks: FinalizeValidationInput): ValidnoResult;
}
export default ValidateEngine;
//# sourceMappingURL=ValidateEngine.d.ts.map