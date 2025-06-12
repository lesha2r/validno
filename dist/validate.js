import checkType from "./validateType.js";
import _errors from "./utils/errors.js";
import checkRules from "./validateRules.js";
import _helpers from "./utils/helpers.js";
import { EValidationId } from "./constants/details.js";
import ValidnoResult from "./ValidnoResult.js";
function handleMissingKey(schema, input) {
    const { key, nestedKey, data, reqs } = input;
    const messageKey = nestedKey || key;
    const messageTitle = reqs.title || messageKey;
    if (!reqs.customMessage) {
        return _errors.getMissingError(messageKey);
    }
    const errorMessage = reqs.customMessage({
        keyword: EValidationId.Missing,
        value: data[key],
        key: messageKey,
        title: messageTitle,
        reqs,
        schema,
    });
    return errorMessage;
}
function validateNestedKey(input) {
    const { results, key, nestedKey, data, reqs } = input;
    const nestedKeys = Object.keys(reqs);
    const nestedResults = [];
    for (const itemKey of nestedKeys) {
        const deepParams = {
            key: itemKey,
            data: data[key],
            reqs: reqs[itemKey],
            nestedKey: `${nestedKey}.${itemKey}`
        };
        const deepResults = validateKey.call(this, deepParams);
        nestedResults.push(deepResults.ok);
        results.merge(deepResults);
    }
    results.fixParentByChilds(nestedKey, nestedResults);
    return results;
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
        return handleMissingNestedKey(results, nestedKey);
    }
    if (_helpers.checkIsNested(reqs)) {
        return validateNestedKey.call(this, { results, key, data, reqs, nestedKey });
    }
    return validateKeyDetails.call(this, {
        results,
        key,
        nestedKey,
        data,
        reqs,
        hasMissing,
    });
}
function handleMissingNestedKey(results, nestedKey) {
    results.setMissing(nestedKey);
    return results;
}
function validateKeyDetails(params) {
    const { results, key, nestedKey, data, reqs, hasMissing } = params;
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (hasMissing) {
        return handleMissingKeyValidation(this.schema, { results, key, nestedKey, data, reqs }, missedCheck);
    }
    checkValueType(results, key, data[key], reqs, nestedKey, typeChecked);
    checkRulesForKey.call(this, results, nestedKey, data[key], reqs, data, rulesChecked);
    return finalizeValidation(results, nestedKey, missedCheck, typeChecked, rulesChecked);
}
function handleMissingKeyValidation(schema, params, missedCheck) {
    const { results, key, nestedKey, data, reqs } = params;
    const errMsg = handleMissingKey(schema, { key, nestedKey, data, reqs });
    missedCheck.push(false);
    results.setMissing(nestedKey, errMsg);
    return results;
}
function checkValueType(results, key, value, reqs, nestedKey, typeChecked) {
    const typeCheck = checkType(key, value, reqs, nestedKey);
    typeCheck.forEach((res) => {
        if (!res.passed) {
            typeChecked.push(false);
            results.errors.push(res.details || '');
        }
    });
}
function checkRulesForKey(results, nestedKey, value, reqs, data, rulesChecked) {
    const ruleCheck = checkRules.call(this, nestedKey, value, reqs, data);
    if (!ruleCheck.ok) {
        rulesChecked.push(false);
        ruleCheck.details.forEach((el) => {
            if (!(nestedKey in results.errorsByKeys))
                results.errorsByKeys[nestedKey] = [];
            results.errors.push(el);
            results.errorsByKeys[nestedKey] = ['1'];
        });
    }
}
function finalizeValidation(results, nestedKey, missedCheck, typeChecked, rulesChecked) {
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
function validateSchema(data, keysToCheck) {
    const output = new ValidnoResult();
    const hasKeysToCheck = _helpers.areKeysLimited(keysToCheck);
    const schemaKeys = Object.entries(this.schema);
    for (const [key, reqs] of schemaKeys) {
        const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, keysToCheck);
        if (!toBeValidated)
            continue;
        const keyResult = validateKey.call(this, { key, data, reqs });
        output.merge(keyResult);
    }
    output.finish();
    return output;
}
;
export default validateSchema;
