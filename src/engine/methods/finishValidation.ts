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

    if (missedCheck.length) results.setMissing(nestedKey);

    const isPassed = !typeChecked.length && !rulesChecked.length && !missedCheck.length;

    if (!isPassed) {
      results.setFailed(nestedKey);
      results.errorsByKeys[nestedKey] = [...results.errors];
    } else {
      results.setPassed(nestedKey);
    }

    return results.finish();
}

export default finishValidation;