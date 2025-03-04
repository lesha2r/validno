import { defaultSchemaKeys } from "../Schema.js";
import ValidnoResult from "../ValidnoResult.js";
import _validations from "./validations.js";
const _helpers = {};
_helpers.checkIsNested = (obj) => {
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
_helpers.mergeResults = (resultsOld, resultsNew) => {
    const output = new ValidnoResult();
    output.failed = [...resultsOld.failed, ...resultsNew.failed];
    output.errors = [...resultsOld.errors, ...resultsNew.errors];
    output.missed = [...resultsOld.missed, ...resultsNew.missed];
    output.passed = [...resultsOld.passed, ...resultsNew.passed];
    output.byKeys = Object.assign(Object.assign({}, resultsOld.byKeys), resultsNew.byKeys);
    output.errorsByKeys = Object.assign(Object.assign({}, resultsOld.errorsByKeys), resultsNew.errorsByKeys);
    return output;
};
_helpers.checkNestedIsMissing = (reqs, data) => {
    const isRequired = reqs.required;
    const isUndef = data === undefined;
    const isEmpty = _validations.isObject(data) && !Object.keys(data).length;
    return isRequired && (isUndef || isEmpty);
};
_helpers.areKeysLimited = (onlyKeys) => {
    const hasArrayOfKeys = (Array.isArray(onlyKeys) && onlyKeys.length > 0);
    const hasStringKey = (typeof onlyKeys === 'string' && onlyKeys.length > 0);
    return hasArrayOfKeys || hasStringKey;
};
_helpers.needValidation = (key, hasLimits, onlyKeys) => {
    const noLimits = !hasLimits;
    const keyIsInList = (key === onlyKeys || Array.isArray(onlyKeys) && (onlyKeys === null || onlyKeys === void 0 ? void 0 : onlyKeys.includes(key)));
    return noLimits || keyIsInList;
};
_helpers.hasMissing = (input) => {
    const { reqs, data, key } = input;
    const isRequired = reqs.required === true;
    const missingData = (data === undefined || key in data === false || data[key] === undefined);
    return isRequired && missingData;
};
export default _helpers;
