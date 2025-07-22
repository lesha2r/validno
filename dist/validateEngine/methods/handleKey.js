import _helpers from "../../utils/helpers.js";
import ValidnoResult from "../../ValidnoResult.js";
function validateKeyValue(params) {
    const { results, key, nestedKey, data, reqs, hasMissing } = params;
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (hasMissing) {
        return this.handleMissingKeyValidation({ results, key, nestedKey, data, reqs, missedCheck });
    }
    this.validateType({ results, key, value: data[key], reqs, nestedKey, typeChecked });
    this.checkRulesForKey({ results, nestedKey, value: data[key], reqs, data, rulesChecked });
    return this.finishValidation({ results, nestedKey, missedCheck, typeChecked, rulesChecked });
}
function validateKey(input) {
    let { results, key, nestedKey, data, reqs } = input;
    if (data === undefined) {
        const noDataResult = new ValidnoResult();
        noDataResult.setNoData();
        noDataResult.finish();
        return noDataResult;
    }
    if (!results)
        results = new ValidnoResult();
    if (!nestedKey)
        nestedKey = key;
    const hasMissing = _helpers.hasMissing(input);
    if (_helpers.checkNestedIsMissing(reqs, data)) {
        return this.handleMissingNestedKey(nestedKey, results);
    }
    if (_helpers.checkIsNested(reqs)) {
        return this.handleNestedKey({ results, key, data, reqs, nestedKey });
    }
    return validateKeyValue.call(this, {
        results,
        key,
        nestedKey,
        data,
        reqs,
        hasMissing,
    });
}
export default validateKey;
