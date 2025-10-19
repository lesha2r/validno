function finishValidation(checks) {
    const { results, nestedKey, missedCheck, typeChecked, rulesChecked } = checks;
    if (missedCheck.length)
        results.setMissing(nestedKey);
    const isPassed = !typeChecked.length && !rulesChecked.length && !missedCheck.length;
    if (!isPassed) {
        results.setFailed(nestedKey);
        results.errorsByKeys[nestedKey] = [...results.errors];
    }
    else {
        results.setPassed(nestedKey);
    }
    return results.finish();
}
export default finishValidation;
