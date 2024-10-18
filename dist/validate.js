import checkRules from "./checkRules.js";
import checkType from "./checkType.js";
import { defaultSchemaKeys } from "./Schema.js";
import _validations from "./utils/validations.js";
const getResultDefaults = () => {
    return {
        ok: null,
        missed: [],
        failed: [],
        passed: [],
        errors: [],
        byKeys: {},
        errorsByKeys: {}
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
const mergeResults = (resultsOld, resultsNew) => {
    const output = getResultDefaults();
    output.failed = [...resultsOld.failed, ...resultsNew.failed];
    output.errors = [...resultsOld.errors, ...resultsNew.errors];
    output.missed = [...resultsOld.missed, ...resultsNew.missed];
    output.passed = [...resultsOld.passed, ...resultsNew.passed];
    output.byKeys = Object.assign(Object.assign({}, resultsOld.byKeys), resultsNew.byKeys);
    output.errorsByKeys = Object.assign(Object.assign({}, resultsOld.errorsByKeys), resultsNew.errorsByKeys);
    return output;
};
const handleReqKey = (key, data, reqs, deepKey = key) => {
    let results = getResultDefaults();
    const hasNested = checkIsNested(reqs);
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (reqs.required && (data === undefined ||
        (_validations.isObject(data) && !Object.keys(data).length))) {
        results.missed.push(deepKey);
        results.failed.push(deepKey);
        results.byKeys[deepKey] = false;
        return results;
    }
    if (hasNested) {
        const nestedReqKeys = Object.keys(reqs);
        results.byKeys[deepKey] = true;
        let i = 0;
        while (i < nestedReqKeys.length) {
            const reqKeyI = nestedReqKeys[i];
            const deepResults = handleReqKey(reqKeyI, data[key], reqs[reqKeyI], deepKey + '.' + reqKeyI);
            results = mergeResults(results, deepResults);
            i++;
        }
        return results;
    }
    if (reqs.required === true && key in data === false || data === undefined) {
        const errMsg = `Missing key '${deepKey}'`;
        missedCheck.push(false);
        results.missed.push(deepKey);
        results.failed.push(deepKey);
        results.errors.push(errMsg);
        results.byKeys[deepKey] = false;
        results.errorsByKeys[deepKey] = [errMsg];
        return results;
    }
    const typeCheck = checkType(key, data[key], reqs, deepKey);
    typeCheck.forEach(res => {
        if (res.passed === false) {
            typeChecked.push(res.passed);
            results.errors.push(res.details);
        }
    });
    const ruleCheck = checkRules(deepKey, data[key], reqs);
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
    results.byKeys[deepKey] = (missedCheck.length + typeChecked.length + rulesChecked.length) === 0;
    return results;
};
const validate = (schema, data) => {
    let results = getResultDefaults();
    for (const [key, reqs] of Object.entries(schema.schema)) {
        const keyResult = handleReqKey(key, data, reqs);
        results = mergeResults(results, keyResult);
    }
    if (results.failed.length)
        results.ok = false;
    else
        results.ok = true;
    return results;
};
export default validate;
