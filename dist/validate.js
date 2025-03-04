import checkType from "./checkType.js";
import _errors from "./utils/errors.js";
import checkRules from "./checkRules.js";
import _helpers from "./utils/helpers.js";
import { ErrorKeywords } from "./constants/details.js";
import ValidnoResult from "./ValidnoResult.js";
function generateMsg(input) {
    let { results, key, deepKey, data, reqs } = input;
    const keyForMsg = deepKey || key;
    const keyTitle = 'title' in reqs ? reqs.title : keyForMsg;
    if (reqs.customMessage && typeof reqs.customMessage === 'function') {
        const errMsg = reqs.customMessage({
            keyword: ErrorKeywords.Missing,
            value: data[key],
            key: keyForMsg,
            title: keyTitle,
            reqs: reqs,
            schema: this.schema
        });
        return errMsg;
    }
    return _errors.getMissingError(keyForMsg);
}
function handleDeepKey(input) {
    const { results, key, deepKey, data, reqs } = input;
    const nesctedKeys = Object.keys(reqs);
    const nestedResults = [];
    let i = 0;
    while (i < nesctedKeys.length) {
        const nestedKey = nesctedKeys[i];
        const deepParams = {
            key: nestedKey,
            data: data[key],
            reqs: reqs[nestedKey],
            deepKey: `${deepKey}.${nestedKey}`
        };
        const deepResults = handleKey.call(this, deepParams);
        nestedResults.push(deepResults.ok);
        results.merge(deepResults);
        i++;
    }
    results.fixParentByChilds(deepKey, nestedResults);
    return results;
}
export function handleKey(input) {
    let { results, key, deepKey, data, reqs } = input;
    if (!results)
        results = new ValidnoResult();
    if (!deepKey)
        deepKey = key;
    const hasNested = _helpers.checkIsNested(reqs);
    const hasMissing = _helpers.hasMissing(input);
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (_helpers.checkNestedIsMissing(reqs, data)) {
        results.setMissing(deepKey);
        return results;
    }
    if (hasNested) {
        return handleDeepKey.call(this, { results, key, data, reqs, deepKey });
    }
    if (hasMissing) {
        let errMsg = generateMsg.call(this, input);
        missedCheck.push(false);
        results.setMissing(deepKey, errMsg);
        return results;
    }
    const typeCheck = checkType(key, data[key], reqs, deepKey);
    typeCheck.forEach(res => {
        if (res.passed === false) {
            typeChecked.push(res.passed);
            results.errors.push(res.details);
        }
    });
    const ruleCheck = checkRules.call(this, deepKey, data[key], reqs, data);
    if (!ruleCheck.ok) {
        rulesChecked.push(false);
        ruleCheck.details.forEach((el) => {
            if (deepKey in results.errorsByKeys)
                results.errorsByKeys[deepKey] = [];
            results.errors.push(el);
            results.errorsByKeys[deepKey] = ['1'];
        });
    }
    if (missedCheck.length)
        results.setMissing(deepKey);
    const isPassed = (!typeChecked.length && !rulesChecked.length && !missedCheck.length);
    if (!isPassed) {
        results.setFailed(deepKey);
        results.errorsByKeys[deepKey] = [
            ...results.errors
        ];
    }
    else {
        results.setPassed(deepKey);
    }
    return results.finish();
}
function validate(schema, data, keysToCheck) {
    const results = new ValidnoResult();
    const hasKeysToCheck = _helpers.areKeysLimited(keysToCheck);
    const schemaKeys = Object.entries(schema.schema);
    for (const [key, reqs] of schemaKeys) {
        const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, keysToCheck);
        if (!toBeValidated)
            continue;
        const keyResult = handleKey.call(this, { key, data, reqs });
        results.merge(keyResult);
    }
    results.finish();
    return results;
}
;
export default validate;
