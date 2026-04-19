import ValidnoResult from "../ValidnoResult.js";

export interface FinalizeValidationInput {
  results: ValidnoResult,
  nestedKey: string,
  missedCheck: boolean[],
  typeChecked: boolean[],
  rulesChecked: boolean[]
}

function finishValidation(checks: FinalizeValidationInput) {
    const {results, nestedKey, missedCheck, typeChecked, rulesChecked } = checks

    const hasMissed = missedCheck.length > 0;
    const hasTypeError = typeChecked.length > 0;
    const hasRuleError = rulesChecked.length > 0;

    if (hasMissed) {
      results.setMissing(nestedKey);
    } else if (hasTypeError || hasRuleError) {
      // Errors already added to errorsByKeys in validate methods, just mark as failed
      results.setFailed(nestedKey);
    } else {
      results.setPassed(nestedKey);
    }

    return results.finish();
}

export default finishValidation;