import checkRules from "./checkRules.js";
import checkType from "./checkType.js";
import _errors from "./utils/errors.js";
import _validations from "./utils/validations.js";
import { defaultSchemaKeys } from "./Schema.js";
export const getResultDefaults = () => {
    return {
        ok: null,
        missed: [],
        failed: [],
        passed: [],
        errors: [],
        byKeys: {},
        byTitles: {},
        errorsByKeys: {},
        errorsByTitles: {}
    };
};
const checkIsNested = (obj) => {
    if (!_validations.isObject(obj))
        return false;
    const objKeys = Object.keys(obj);
    if (objKeys.every((k) => defaultSchemaKeys.includes(k))) {
        return false;
    }
    else {
        return true;
    }
};
export const mergeResults = (resultsOld, resultsNew) => {
    const output = getResultDefaults();
    output.failed = [...resultsOld.failed, ...resultsNew.failed];
    output.errors = [...resultsOld.errors, ...resultsNew.errors];
    output.missed = [...resultsOld.missed, ...resultsNew.missed];
    output.passed = [...resultsOld.passed, ...resultsNew.passed];
    output.byKeys = Object.assign(Object.assign({}, resultsOld.byKeys), resultsNew.byKeys);
    output.byTitles = Object.assign(Object.assign({}, resultsOld.byTitles), resultsNew.byTitles);
    output.errorsByKeys = Object.assign(Object.assign({}, resultsOld.errorsByKeys), resultsNew.errorsByKeys);
    output.errorsByTitles = Object.assign(Object.assign({}, resultsOld.errorsByTitles), resultsNew.errorsByTitles);
    return output;
};
export function handleReqKey(key, data, reqs, deepKey = key) {
    let results = getResultDefaults();
    const hasNested = checkIsNested(reqs);
    const keyTitle = 'title' in reqs ? reqs.title : deepKey;
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (reqs.required && (data === undefined ||
        (_validations.isObject(data) && !Object.keys(data).length))) {
        results.missed.push(deepKey);
        results.failed.push(deepKey);
        results.byKeys[deepKey] = false;
        results.byTitles[keyTitle] = false;
        return results;
    }
    if (hasNested) {
        const nestedReqKeys = Object.keys(reqs);
        results.byKeys[deepKey] = true;
        results.byTitles[keyTitle] = true;
        let i = 0;
        while (i < nestedReqKeys.length) {
            const reqKeyI = nestedReqKeys[i];
            const deepResults = handleReqKey.call(this, reqKeyI, data[key], reqs[reqKeyI], deepKey + '.' + reqKeyI);
            results = mergeResults(results, deepResults);
            i++;
        }
        return results;
    }
    if (reqs.required === true && key in data === false || data === undefined) {
        let errMsg = _errors.getMissingError(deepKey);
        if (reqs.customMessage && typeof reqs.customMessage === 'function') {
            errMsg = reqs.customMessage({
                value: data[key], key: deepKey, title: keyTitle, reqs: reqs, schema: this.schema
            });
        }
        missedCheck.push(false);
        results.missed.push(deepKey);
        results.failed.push(deepKey);
        results.errors.push(errMsg);
        results.byKeys[deepKey] = false;
        results.byTitles[keyTitle] = false;
        results.errorsByKeys[deepKey] = [errMsg];
        results.errorsByTitles[keyTitle] = [errMsg];
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
            if (deepKey in results.errorsByTitles)
                results.errorsByTitles[keyTitle] = [];
            results.errors.push(el);
            results.errorsByKeys[deepKey] = ['1'];
            results.errorsByTitles[keyTitle] = ['1'];
        });
    }
    if (missedCheck.length)
        results.missed.push(deepKey);
    if (typeChecked.length || rulesChecked.length) {
        results.failed.push(deepKey);
    }
    else {
        results.passed.push(deepKey);
    }
    results.errorsByKeys[deepKey] = [
        ...results.errors
    ];
    results.errorsByTitles[keyTitle] = [
        ...results.errors
    ];
    results.byKeys[deepKey] = (missedCheck.length + typeChecked.length + rulesChecked.length) === 0;
    results.byTitles[keyTitle] = (missedCheck.length + typeChecked.length + rulesChecked.length) === 0;
    return results;
}
const isCheckNeeded = (key, hasLimits, onlyKeys) => {
    return !hasLimits || (key === onlyKeys || Array.isArray(onlyKeys) && (onlyKeys === null || onlyKeys === void 0 ? void 0 : onlyKeys.includes(key)));
};
function validate(schema, data, onlyKeys) {
    let results = getResultDefaults();
    const areKeysLimited = (Array.isArray(onlyKeys) && onlyKeys.length > 0) || (typeof onlyKeys === 'string' && onlyKeys.length > 0);
    for (const [key, reqs] of Object.entries(schema.schema)) {
        if (isCheckNeeded(key, areKeysLimited, onlyKeys)) {
            const keyResult = handleReqKey.call(this, key, data, reqs);
            results = mergeResults(results, keyResult);
        }
    }
    if (results.failed.length)
        results.ok = false;
    else
        results.ok = true;
    return results;
}
;
export default validate;
