import checkRules from "./checkRules.js";
import checkType from "./checkType.js";
import { defaultSchemaKeys } from "./Schema.js";
const getResultDefault = () => {
    return {
        ok: null,
        missed: [],
        failed: [],
        passed: [],
        errors: [],
        byKeys: {}
    };
};
const checkIsNested = (obj) => {
    const objKeys = Object.keys(obj);
    if (objKeys.every((k) => defaultSchemaKeys.includes(k))) {
        return false;
    }
    else {
        return true;
    }
};
const handleReqKey = (key, data, reqs, deepKey = key) => {
    console.log('..................... ', key);
    const results = getResultDefault();
    const hasNested = checkIsNested(reqs);
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (hasNested) {
        const nestedReqKeys = Object.keys(reqs);
        let i = 0;
        while (i < nestedReqKeys.length) {
            const reqKeyI = nestedReqKeys[i];
            const deepResults = handleReqKey(reqKeyI, data[key], reqs[reqKeyI], deepKey + '.' + reqKeyI);
            results.failed = [...results.failed, ...deepResults.failed];
            results.errors = [...results.errors, ...deepResults.errors];
            results.missed = [...results.missed, ...deepResults.missed];
            results.passed = [...results.passed, ...deepResults.passed];
            results.byKeys = Object.assign(Object.assign({}, results.byKeys), deepResults.byKeys);
            i++;
        }
        return results;
    }
    if (reqs.required === true && key in data === false) {
        missedCheck.push(false);
        results.errors.push(`Missing key '${deepKey}'`);
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
        ruleCheck.details.forEach((el) => results.errors.push(el));
    }
    if (missedCheck.length) {
        results.missed.push(deepKey);
    }
    if (typeChecked.length || rulesChecked.length) {
        results.failed.push(deepKey);
    }
    else {
        results.passed.push(deepKey);
    }
    console.log(missedCheck.length, typeChecked.length, rulesChecked.length);
    results.byKeys[deepKey] = (missedCheck.length + typeChecked.length + rulesChecked.length) === 0;
    console.log(results);
    return results;
};
const validate = (schema, data) => {
    const results = getResultDefault();
    for (const [key, reqs] of Object.entries(schema.schema)) {
        const keyResult = handleReqKey(key, data, reqs);
        results.failed = [...results.failed, ...keyResult.failed];
        results.errors = [...results.errors, ...keyResult.errors];
        results.missed = [...results.missed, ...keyResult.missed];
        results.passed = [...results.passed, ...keyResult.passed];
        results.byKeys = Object.assign(Object.assign({}, results.byKeys), keyResult.byKeys);
    }
    if (results.failed.length)
        results.ok = false;
    else
        results.ok = true;
    results.missed = [...new Set(results.missed)];
    results.failed = [...new Set(results.failed)];
    results.passed = [...new Set(results.passed)];
    results.errors = [...new Set(results.errors)];
    return results;
};
class Validator {
    constructor() { }
}
Validator.validate = validate;
export default Validator;
