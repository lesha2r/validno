import ValidnoResult from "../ValidnoResult.js";
export interface FinalizeValidationInput {
    results: ValidnoResult;
    nestedKey: string;
    missedCheck: boolean[];
    typeChecked: boolean[];
    rulesChecked: boolean[];
}
declare function finishValidation(checks: FinalizeValidationInput): ValidnoResult;
export default finishValidation;
//# sourceMappingURL=finishValidation.d.ts.map