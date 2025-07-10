import _validations from "./validations.js";
import { defaultSchemaKeys } from "../Schema.js";
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
_helpers.compareArrs = (v1, v2) => {
    if (v1.length !== v2.length)
        return false;
    return v1.every((el, i) => {
        if (_validations.isObject(el)) {
            return JSON.stringify(el) === JSON.stringify(v2[i]);
        }
        return v2[i] === el;
    });
};
_helpers.compareObjs = (obj1, obj2) => {
    function deepEqual(obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        }
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }
        return true;
    }
    return deepEqual(obj1, obj2);
};
export default _helpers;
