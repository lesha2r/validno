import _helpers from "../../utils/helpers.js";
import ValidnoResult from "../../ValidnoResult.js";
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
        return this.validateNestedKey({ results, key, data, reqs, nestedKey });
    }
    return this.validateKeyDetails({
        results,
        key,
        nestedKey,
        data,
        reqs,
        hasMissing,
    });
}
export default validateKey;
